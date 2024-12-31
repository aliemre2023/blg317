import os

def replace_text_in_file(file_path, old_text, new_text):
    """Replace old_text with new_text in the given file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        updated_content = content.replace(old_text, new_text)

        if content != updated_content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(updated_content)
            print(f"Updated: {file_path}")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def replace_in_directory(directory, old_text, new_text):
    """Recursively replace old_text with new_text in all files in the given directory."""
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            replace_text_in_file(file_path, old_text, new_text)

if __name__ == "__main__":
    directory = os.getcwd()  # Start from the current directory
    old_text = "https://blg317api.onrender.com"
    new_text = "https://blg317api.onrender.com"

    print(f"Starting traversal from: {directory}")
    replace_in_directory(directory, old_text, new_text)
