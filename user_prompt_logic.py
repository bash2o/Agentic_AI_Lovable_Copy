DESIGN_STYLES = {
    "M": "modern, clean, structured, and minimal",
    "P": "playful, fun, dynamic, and creative",
    "E": "elegant, sophisticated, refined, and minimal",
    "G": "girly, cute, soft, and aesthetic",
    "D": "dark, bold, sleek, and high-contrast",
    "C": "classic, simple, balanced, and timeless"
}

COLOR_THEMES = {
    "B": "blue",
    "P": "pink",
    "G": "green",
    "O": "orange",
    "M": "monochrome"
}

def get_user_prompt(basic_user_prompt, design_user_prompt, color_user_prompt)->str:
    ui_design_prompt = create_design_prompt(design_user_prompt, color_user_prompt)
    user_prompt = basic_user_prompt + " " + ui_design_prompt
    return user_prompt


def create_design_prompt(design_choice, color_choice) -> str:
    design_style = DESIGN_STYLES.get(design_choice, design_choice)
    color_theme = COLOR_THEMES.get(color_choice, color_choice)

    return (
        f"Design style: {design_style}. "
        f"Color theme: {color_theme}."
    )
