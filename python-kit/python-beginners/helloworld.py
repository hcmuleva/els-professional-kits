# I need to make a contion and print odd and even numbers.
# how we say a number is number is even or odd . number %2
# read a file and print content of it
def print_file_content(file_path):
    try:
        with open(file_path, 'r') as harishfile:
            content = harishfile.read()
            print("File Content:")
            print(content)
    except FileNotFoundError:
        print(f"The file at {file_path} was not found.")

def write_file_content(file_path, content):
    with open(file_path, 'w') as harishfile:
        harishfile.write(content)
        print(f"Content written to {file_path}")
def square(num):
    return num * num

# for i in range (1,11):
#     if(i%2==0):
#         print(f"{i} is even number")
#         square_num = square(i)
#         print(f"The square of {i} is {square_num}")
#     else:
#         print(f"{i} is odd number")
filepath="harishdemo.txt"
write_file_content(filepath, "This is my demo file for writing.")
print_file_content(filepath)
print("Hello world")