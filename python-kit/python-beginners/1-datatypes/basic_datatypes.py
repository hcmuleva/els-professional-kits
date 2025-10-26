#!/usr/bin/env python3
"""
Python Basic Data Types
========================
This program demonstrates all basic Python data types with examples.
"""

def demonstrate_numbers():
    """Demonstrate numeric data types"""
    print("=" * 50)
    print("NUMERIC DATA TYPES")
    print("=" * 50)
    
    # Integer
    age = 25
    print(f"Integer: {age}, Type: {type(age)}")
    
    # Float
    height = 5.9
    print(f"Float: {height}, Type: {type(height)}")
    
    # Complex
    complex_num = 3 + 4j
    print(f"Complex: {complex_num}, Type: {type(complex_num)}")
    
    # Mathematical operations
    print("\nMath Operations:")
    print(f"Addition: 10 + 5 = {10 + 5}")
    print(f"Subtraction: 10 - 5 = {10 - 5}")
    print(f"Multiplication: 10 * 5 = {10 * 5}")
    print(f"Division: 10 / 3 = {10 / 3}")
    print(f"Floor Division: 10 // 3 = {10 // 3}")
    print(f"Modulus: 10 % 3 = {10 % 3}")
    print(f"Power: 2 ** 3 = {2 ** 3}")

def demonstrate_strings():
    """Demonstrate string data type"""
    print("\n" + "=" * 50)
    print("STRING DATA TYPE")
    print("=" * 50)
    
    # Different ways to create strings
    name = "Alice"
    message = 'Hello World'
    multiline = """This is a
    multiline string"""
    
    print(f"Single quotes: {name}, Type: {type(name)}")
    print(f"Double quotes: {message}")
    print(f"Triple quotes:\n{multiline}")
    
    # String operations
    first_name = "John"
    last_name = "Doe"
    full_name = first_name + " " + last_name
    print(f"\nString concatenation: {full_name}")
    
    # String methods
    sample_text = "  Python Programming  "
    print(f"\nOriginal: '{sample_text}'")
    print(f"Upper: '{sample_text.upper()}'")
    print(f"Lower: '{sample_text.lower()}'")
    print(f"Strip: '{sample_text.strip()}'")
    print(f"Replace: '{sample_text.replace('Python', 'Java')}'")
    print(f"Length: {len(sample_text)}")
    
    # String formatting
    age = 30
    print("\nString formatting:")
    print(f"f-string: My name is {first_name} and I'm {age} years old")
    print("format(): My name is {} and I'm {} years old".format(first_name, age))
    print("% formatting: My name is %s and I'm %d years old" % (first_name, age))

def demonstrate_boolean():
    """Demonstrate boolean data type"""
    print("\n" + "=" * 50)
    print("BOOLEAN DATA TYPE")
    print("=" * 50)
    
    is_student = True
    is_working = False
    
    print(f"Boolean True: {is_student}, Type: {type(is_student)}")
    print(f"Boolean False: {is_working}, Type: {type(is_working)}")
    
    # Boolean operations
    print(f"\nBoolean Operations:")
    print(f"True and False = {True and False}")
    print(f"True or False = {True or False}")
    print(f"not True = {not True}")
    print(f"not False = {not False}")
    
    # Truthy and Falsy values
    print(f"\nTruthy/Falsy values:")
    values = [0, 1, "", "hello", [], [1, 2], None, {}, {"key": "value"}]
    for value in values:
        print(f"{repr(value)} is {'Truthy' if value else 'Falsy'}")

def demonstrate_collections():
    """Demonstrate collection data types"""
    print("\n" + "=" * 50)
    print("COLLECTION DATA TYPES")
    print("=" * 50)
    
    # List - ordered, mutable
    fruits = ["apple", "banana", "orange"]
    print(f"List: {fruits}, Type: {type(fruits)}")
    fruits.append("grape")
    print(f"After append: {fruits}")
    print(f"First fruit: {fruits[0]}")
    print(f"Last fruit: {fruits[-1]}")
    
    # Tuple - ordered, immutable
    coordinates = (10, 20)
    print(f"\nTuple: {coordinates}, Type: {type(coordinates)}")
    print(f"X coordinate: {coordinates[0]}")
    print(f"Y coordinate: {coordinates[1]}")
    
    # Dictionary - key-value pairs, mutable
    person = {"name": "Alice", "age": 30, "city": "New York"}
    print(f"\nDictionary: {person}, Type: {type(person)}")
    print(f"Name: {person['name']}")
    person["age"] = 31
    print(f"After age update: {person}")
    
    # Set - unique elements, mutable
    numbers = {1, 2, 3, 3, 4, 4, 5}
    print(f"\nSet: {numbers}, Type: {type(numbers)}")
    numbers.add(6)
    print(f"After adding 6: {numbers}")

def demonstrate_none():
    """Demonstrate None data type"""
    print("\n" + "=" * 50)
    print("NONE DATA TYPE")
    print("=" * 50)
    
    result = None
    print(f"None value: {result}, Type: {type(result)}")
    print(f"Is None: {result is None}")
    print(f"Is not None: {result is not None}")

def main():
    """Main function to run all demonstrations"""
    print("Python Data Types Demonstration")
    print("This program shows examples of all basic Python data types.\n")
    
    demonstrate_numbers()
    demonstrate_strings()
    demonstrate_boolean()
    demonstrate_collections()
    demonstrate_none()
    
    print("\n" + "=" * 50)
    print("PROGRAM COMPLETED!")
    print("=" * 50)

if __name__ == "__main__":
    main()