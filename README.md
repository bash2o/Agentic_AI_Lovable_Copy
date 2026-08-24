# Agentic AI Web App Builder

This project is an AI-powered web application builder inspired by platforms like Lovable. The main goal of this project is to allow users to describe a web application using a natural language prompt and let an agentic AI system plan, architect, and implement the application automatically.

While building this project, I used Python, LangGraph, LangChain, Groq Cloud and the `openai/gpt-oss-120b` LLM model.

The project uses a multi-stage agentic workflow. Instead of asking a single LLM to generate an entire application at once, different agents are responsible for different parts of the development process.

There are 3 main stages in the project:

1. **Planner** - Creates a high-level project plan from the user's prompt.
2. **Architect** - Converts the plan into detailed implementation tasks.
3. **Coder** - Implements those tasks and interacts with the generated project using tools.

The overall workflow looks like this:

```text
User Prompt
     ↓
  Planner
     ↓
    Plan
     ↓
 Architect
     ↓
  TaskPlan
     ↓
   Coder
     ↓
  Tools
     ↓
Generated Project
```

Let's cover what is inside this project.

# First, let's start with our `graph.py` file.


This is the main file of the project. It is responsible for creating and running our LangGraph workflow.

In this file, we load our environment variables and initialize our LLM using Groq Cloud.

The LLM model used in this project is:

`openai/gpt-oss-120b`

We also use LangChain's debug and verbose modes to see more detailed information about what is happening internally during execution.

Our graph contains three main nodes:

* **Planner**
* **Architect**
* **Coder**

The graph starts with the Planner and moves to the Architect. After the Architect creates the implementation plan, the Coder starts implementing the application.

The graph is created using `StateGraph` and the nodes are connected with edges.

The workflow is:

```text
Planner → Architect → Coder
                       ↓
                     Coder
                       ↓
                     Coder
                       ↓
                      END
```

The Coder can run multiple times because the Architect may create multiple implementation steps.

# Let's continue with our `planner_agent` function.


The Planner is responsible for converting the user's natural language request into a structured engineering plan.

For example, if the user provides:

```text
Build a colourful modern todo app in html css and js
```

the Planner analyzes the request and creates a structured `Plan`.

We use:

```python
llm.with_structured_output(Plan)
```

This means that instead of simply asking the LLM to return plain text, we ask it to return information that follows our predefined Pydantic schema.

The generated plan contains:

* Application name
* Application description
* Technology stack
* Features
* Files that need to be created

After the Planner creates the plan, we add it to the LangGraph state:

```python
return {"plan": resp}
```

This allows the Architect node to access the Planner's result.

# Now it's time for our `architect_agent` function.

The Architect takes the high-level project plan created by the Planner and turns it into detailed engineering tasks.

The main difference between the Planner and Architect is that the Planner focuses on **what the application should be**, while the Architect focuses on **how the application should be implemented**.

The Architect receives the previous plan and uses:

```python
llm.with_structured_output(TaskPlan)
```

to create a structured implementation plan.

The Architect is instructed to:

* Create tasks for each file in the plan.
* Specify exactly what needs to be implemented.
* Define relevant variables, functions, classes and components.
* Explain dependencies between tasks.
* Include imports and expected function signatures.
* Explain data flow and integration details.
* Order tasks according to their dependencies.

The result is stored as a `TaskPlan`.

For example, the Architect might create tasks such as:

```text
1. Create the HTML structure
2. Create the CSS styling
3. Implement the JavaScript logic
4. Add todo functionality
5. Add filtering functionality
```

After the Architect creates the `TaskPlan`, we also attach the original `Plan` to it:

```python
resp.plan = plan
```

This allows us to preserve the original high-level project plan together with the implementation plan.

# Now let's move to our `coder_agent` function.


The Coder is responsible for actually implementing the application.

The Coder receives the `TaskPlan` created by the Architect and works through its implementation steps one by one.

To keep track of its progress, we use the `CoderState` model.

The `current_step_idx` variable tells the Coder which implementation step it is currently working on.

For example:

```text
current_step_idx = 0 → index.html
current_step_idx = 1 → style.css
current_step_idx = 2 → script.js
```

Before working on the current task, the Coder reads the existing file content using the `read_file` tool.

It then receives:

* The current task
* The target file
* The existing file content
* Instructions for saving the changes

This allows the Coder to work with the current state of the project instead of blindly generating files from scratch.

# The Coder Agent and `create_agent`


One of the main agentic parts of this project is inside the Coder node.

We create a tool-using agent with:

```python
create_agent(llm, coder_tools)
```

The Coder receives several tools that allow it to interact with the generated project.

These tools are:

* `read_file`
* `write_file`
* `list_files`
* `get_current_directory`

This means the Coder is not only generating text. It can interact with the project environment through tools.

The architecture can therefore be viewed as:

```text
LangGraph
│
├── Planner
│
├── Architect
│
└── Coder
      │
      └── Tool-Using Agent
            ├── read_file
            ├── write_file
            ├── list_files
            └── get_current_directory
```

LangGraph is responsible for orchestrating the overall workflow, while the Coder contains a tool-using agent responsible for interacting with the project files.

# Now let's continue with our `states.py` file.


The `states.py` file contains the Pydantic models that define the structure of the information used throughout the project.

There are five main models in this file:

* `File`
* `Plan`
* `ImplementationTask`
* `TaskPlan`
* `CoderState`

The `File` model represents a file that needs to be created or modified and contains its path and purpose.

The `Plan` model represents the high-level application specification created by the Planner. It contains:

* `name`
* `description`
* `tech_stack`
* `features`
* `files`

The `ImplementationTask` model represents a single engineering task. It contains the target file and a detailed description of what needs to be implemented.

The `TaskPlan` contains the list of implementation steps created by the Architect.

Finally, `CoderState` keeps track of the Coder's progress. It contains the current `TaskPlan`, the current implementation step index and the current file content.

Using Pydantic models makes the communication between different parts of the agentic workflow more structured and predictable.

# Now let's talk about our `prompts.py` file.


The `prompts.py` file contains the prompts used by our different agents.

Instead of using one general prompt for the whole system, each agent has its own instructions based on its responsibility.

The `planner_prompt` instructs the Planner to convert the user's request into a complete engineering project plan.

The `architect_prompt` instructs the Architect to transform that project plan into explicit implementation tasks.

It also provides rules about dependencies, imports, function signatures, data flow and implementation order.

Finally, the `coder_system_prompt` defines how the Coder should implement its task.

The Coder is instructed to:

* Review existing files.
* Maintain compatibility between modules.
* Implement the full file content.
* Keep naming consistent.
* Make sure imported modules exist and are implemented correctly.

Keeping these prompts in a separate file makes the project more modular and makes it easier to modify the behavior of individual agents.

# Let's continue with our `tools.py` file.


The `tools.py` file contains the tools that allow our Coder agent to interact with the generated project.

The main tools are:

* `write_file`
* `read_file`
* `list_files`
* `get_current_directory`
* `run_cmd`

We also have an `init_project_root` function that creates the project directory.

The generated applications are stored inside:

```text
generated_project/
```

The `write_file` tool allows the agent to create or modify files.

The `read_file` tool allows the agent to inspect existing files before making changes.

The `list_files` tool allows the agent to see which files currently exist in the project.

The `get_current_directory` tool returns the current project directory.

The `run_cmd` tool allows commands to be executed inside the generated project directory.

# Project Root Safety


Since the Coder has access to tools that can read and write files, it is important to control where these operations can happen.

For this reason, the project uses the `safe_path_for_project` function.

Before a file is accessed, its path is resolved and checked to make sure it stays inside the `generated_project` directory.

If an attempt is made to access a location outside the project root, the function raises an error:

```text
Attempt to write outside project root
```

This provides a controlled environment for the generated application and prevents file operations from escaping the project directory.

# How does the Coder know when to stop?


After completing an implementation task, the Coder increments:

```python
current_step_idx
```

The LangGraph conditional edge then checks whether all implementation steps have been completed.

If there are still tasks remaining, the graph sends the state back to the Coder.

```text
Coder
  ↓
More tasks?
  ↓ YES
Coder
  ↓
More tasks?
  ↓ YES
Coder
  ↓
All tasks completed
  ↓
END
```

When the current step index reaches the number of implementation steps, the Coder returns:

```python
status = "DONE"
```

and LangGraph terminates the workflow.

# Overall Architecture


The complete architecture of the project can be summarized as:

```text
                     USER PROMPT
                          │
                          ▼
                    ┌───────────┐
                    │  PLANNER  │
                    └─────┬─────┘
                          │
                        Plan
                          │
                          ▼
                   ┌─────────────┐
                   │  ARCHITECT  │
                   └──────┬──────┘
                          │
                      TaskPlan
                          │
                          ▼
                    ┌──────────┐
                    │   CODER  │
                    └────┬─────┘
                         │
                  Tool-Using Agent
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
         read_file   write_file   list_files
                         │
                         ▼
                  Generated Project
                         │
                         ▼
                    Next Task
                         │
                         └──────→ Coder
                                    │
                              All Tasks Done
                                    │
                                    ▼
                                   END
```

The main purpose of this architecture is to separate responsibilities between different agents.

The Planner focuses on understanding the user's requirements.

The Architect focuses on transforming those requirements into detailed engineering tasks.

The Coder focuses on implementing those tasks and interacting with the generated project using tools.

# Technologies Used

* Python
* LangGraph
* LangChain
* Groq Cloud
* `openai/gpt-oss-120b`
* Pydantic
* python-dotenv

# Example

For example, if we provide the following prompt:

```text
Build a colourful modern todo app in html css and js
```

the system can:

1. Analyze the user's request.
2. Create a structured application plan.
3. Determine the required files and features.
4. Break the plan into implementation tasks.
5. Create and modify project files.
6. Use tools to read and write files.
7. Continue through all implementation steps.
8. Save the generated application inside the project directory.

This project helped me understand how LLMs, structured outputs, agents, tools and LangGraph can work together to build an agentic AI system.

Thank you for reading! Hope to see you in my next projects
