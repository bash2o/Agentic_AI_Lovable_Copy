import argparse
import sys
import traceback

from agent.graph import agent


def main():
    parser = argparse.ArgumentParser(description="Run engineering project planner")
    parser.add_argument("--recursion-limit", "-r", type=int, default=100,
                        help="Recursion limit for processing (default: 100)")

    args = parser.parse_args()

    try:
        basic_user_prompt = input(    # in this part I changed user_prompt into basic_user_prompt
            "Enter your project prompt: "
        )
        design_user_prompt = input(
            "Choose a style for your project. The styles are:\n"
            "M - Modern: clean, structured, and minimal design\n"
            "P - Playful: fun, dynamic, and creative design\n"
            "E - Elegant: sophisticated, refined, and minimal design\n"
            "G - Girly: cute, soft, and aesthetic design\n"
            "D - Dark: bold, sleek, and high-contrast design\n"
            "C - Classic: simple, balanced, and timeless design\n"
            "For custom style you can directly type it\n"
            "Your choice: "
        )
        color_user_prompt = input(
            "Choose a color theme for your project.\n"
            "B - Blue\n"
            "P - Pink\n"
            "G - Green\n"
            "O - Orange\n"
            "M - Monochrome (black, white, gray)\n"
            "For custom color theme you can directly type it\n"
            "Your choice: "
        )

        user_prompt = user_prompt_logic.get_user_prompt(basic_user_prompt, design_user_prompt, color_user_prompt)
        
        result = agent.invoke(
            {"user_prompt": user_prompt},
            {"recursion_limit": args.recursion_limit}
        )
        print("Final State:", result)
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
        sys.exit(0)
    except Exception as e:
        traceback.print_exc()
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
