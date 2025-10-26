#!/usr/bin/env python3
"""
Python Type Conversion (Type Casting)
=====================================
This program demonstrates how to convert between different data types.
"""

def demonstrate_implicit_conversion():
    """Show automatic type conversion"""
    print("=" * 50)
    print("IMPLICIT TYPE CONVERSION")
    print("=" * 50)
    
    # Python automatically converts int to float during operations
    num_int = 10
    num_float = 3.5
    result = num_int + num_float
    
    print(f"Integer: {num_int} (type: {type(num_int)})")
    print(f"Float: {num_float} (type: {type(num_float)})")
    print(f"Result: {result} (type: {type(result)})")
    print("Python automatically converted int to float!")

def demonstrate_explicit_conversion():
    """Show manual type conversion"""
    print("\n" + "=" * 50)
    print("EXPLICIT TYPE CONVERSION")
    print("=" * 50)
    
    # String to Number
    str_number = "123"
    print(f"String: '{str_number}' (type: {type(str_number)})")
    
    converted_int = int(str_number)
    converted_float = float(str_number)
    print(f"To int: {converted_int} (type: {type(converted_int)})")
    print(f"To float: {converted_float} (type: {type(converted_float)})")
    
    # Number to String
    number = 456
    str_from_number = str(number)
    print(f"\nNumber: {number} (type: {type(number)})")
    print(f"To string: '{str_from_number}' (type: {type(str_from_number)})")
    
    # Boolean conversions
    print(f"\nBoolean conversions:")
    print(f"bool(1): {bool(1)}")
    print(f"bool(0): {bool(0)}")
    print(f"bool('hello'): {bool('hello')}")
    print(f"bool(''): {bool('')}")
    print(f"int(True): {int(True)}")
    print(f"int(False): {int(False)}")

def demonstrate_collection_conversions():
    """Show conversions between collections"""
    print("\n" + "=" * 50)
    print("COLLECTION TYPE CONVERSIONS")
    print("=" * 50)
    
    # List to other types
    original_list = [1, 2, 3, 2, 1]
    print(f"Original list: {original_list}")
    
    # List to tuple
    list_to_tuple = tuple(original_list)
    print(f"List to tuple: {list_to_tuple}")
    
    # List to set (removes duplicates)
    list_to_set = set(original_list)
    print(f"List to set: {list_to_set}")
    
    # String to list
    text = "hello"
    string_to_list = list(text)
    print(f"\nString '{text}' to list: {string_to_list}")
    
    # List to string
    char_list = ['h', 'e', 'l', 'l', 'o']
    list_to_string = ''.join(char_list)
    print(f"List {char_list} to string: '{list_to_string}'")

def demonstrate_error_handling():
    """Show what happens with invalid conversions"""
    print("\n" + "=" * 50)
    print("HANDLING CONVERSION ERRORS")
    print("=" * 50)
    
    # Valid conversion
    try:
        result = int("123")
        print(f"int('123') = {result} ✓")
    except ValueError as e:
        print(f"Error: {e}")
    
    # Invalid conversion
    try:
        result = int("hello")
        print(f"int('hello') = {result}")
    except ValueError as e:
        print(f"int('hello') failed: {e} ✗")
    
    # Safe conversion with default
    def safe_int_conversion(value, default=0):
        try:
            return int(value)
        except ValueError:
            return default
    
    print(f"\nSafe conversions with defaults:")
    print(f"safe_int_conversion('123') = {safe_int_conversion('123')}")
    print(f"safe_int_conversion('hello') = {safe_int_conversion('hello')}")
    print(f"safe_int_conversion('hello', -1) = {safe_int_conversion('hello', -1)}")

def practical_examples():
    """Real-world examples of type conversion"""
    print("\n" + "=" * 50)
    print("PRACTICAL EXAMPLES")
    print("=" * 50)
    
    # Example 1: User input (always comes as string)
    print("Example 1: Processing user input")
    user_age = "25"  # Simulating input("Enter your age: ")
    print(f"User input: '{user_age}' (type: {type(user_age)})")
    
    age_number = int(user_age)
    next_year = age_number + 1
    print(f"Next year you'll be: {next_year}")
    
    # Example 2: Reading numbers from a file or CSV
    print("\nExample 2: Processing CSV-like data")
    csv_row = "John,30,Engineer,75000.50"
    fields = csv_row.split(',')
    print(f"Raw fields: {fields}")
    
    name = fields[0]  # Keep as string
    age = int(fields[1])  # Convert to int
    job = fields[2]  # Keep as string
    salary = float(fields[3])  # Convert to float
    
    print(f"Name: {name} (type: {type(name)})")
    print(f"Age: {age} (type: {type(age)})")
    print(f"Job: {job} (type: {type(job)})")
    print(f"Salary: ${salary:,.2f} (type: {type(salary)})")
    
    # Example 3: Formatting output
    print(f"\nFormatted output: {name} is {age} years old and earns ${salary:,.2f}")

def main():
    """Main function to run all demonstrations"""
    print("Python Type Conversion Demonstration")
    print("This program shows how to convert between data types.\n")
    
    demonstrate_implicit_conversion()
    demonstrate_explicit_conversion()
    demonstrate_collection_conversions()
    demonstrate_error_handling()
    practical_examples()
    
    print("\n" + "=" * 50)
    print("PROGRAM COMPLETED!")
    print("=" * 50)

if __name__ == "__main__":
    main()