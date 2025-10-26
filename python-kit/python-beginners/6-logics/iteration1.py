#!/usr/bin/env python3
"""
Iteration 1: Basic Triangle Patterns
====================================
This program demonstrates simple triangle patterns using nested loops.
Focus: Basic loop concepts and pattern recognition.
"""

def draw_right_triangle(height):
    """Draw a right-angled triangle with stars"""
    print(f"\n--- Right Triangle (Height: {height}) ---")
    for i in range(1, height + 1):
        print("* " * i)

def draw_number_triangle(height):
    """Draw a triangle with numbers"""
    print(f"\n--- Number Triangle (Height: {height}) ---")
    for i in range(1, height + 1):
        for j in range(1, i + 1):
            print(j, end=" ")
        print()  # New line after each row

def draw_reverse_triangle(height):
    """Draw a reverse triangle (upside down)"""
    print(f"\n--- Reverse Triangle (Height: {height}) ---")
    for i in range(height, 0, -1):
        print("* " * i)

def draw_pyramid_triangle(height):
    """Draw a centered pyramid triangle"""
    print(f"\n--- Pyramid Triangle (Height: {height}) ---")
    for i in range(1, height + 1):
        # Print spaces for centering
        spaces = " " * (height - i)
        # Print stars
        stars = "* " * i
        print(spaces + stars)

def draw_hollow_triangle(height):
    """Draw a hollow triangle (only outline)"""
    print(f"\n--- Hollow Triangle (Height: {height}) ---")
    for i in range(1, height + 1):
        if i == 1:
            # First row: just one star
            print(" " * (height - 1) + "*")
        elif i == height:
            # Last row: filled row
            print("* " * height)
        else:
            # Middle rows: hollow
            spaces_before = " " * (height - i)
            spaces_between = " " * (2 * i - 3)
            print(spaces_before + "*" + spaces_between + "*")

def triangle_challenge():
    """Interactive challenge for the user"""
    print("\n" + "="*50)
    print("TRIANGLE CHALLENGE")
    print("="*50)
    
    try:
        height = int(input("Enter triangle height (3-10): "))
        if height < 3 or height > 10:
            print("Please enter a number between 3 and 10!")
            return
        
        pattern = input("Choose pattern (right/number/reverse/pyramid/hollow): ").lower()
        
        if pattern == "right":
            draw_right_triangle(height)
        elif pattern == "number":
            draw_number_triangle(height)
        elif pattern == "reverse":
            draw_reverse_triangle(height)
        elif pattern == "pyramid":
            draw_pyramid_triangle(height)
        elif pattern == "hollow":
            draw_hollow_triangle(height)
        else:
            print("Invalid pattern choice!")
            
    except ValueError:
        print("Please enter a valid number!")

def main():
    """Main function demonstrating all triangle patterns"""
    print("Iteration 1: Basic Triangle Patterns")
    print("This program shows various triangle patterns using stars and numbers.\n")
    
    # Demonstrate all patterns with height 5
    height = 5
    
    draw_right_triangle(height)
    draw_number_triangle(height)
    draw_reverse_triangle(height)
    draw_pyramid_triangle(height)
    draw_hollow_triangle(height)
    
    # Interactive challenge
    triangle_challenge()
    
    print("\n" + "="*50)
    print("Key Learning Points:")
    print("1. Nested loops for pattern creation")
    print("2. Loop control with range()")
    print("3. String multiplication for patterns")
    print("4. Basic user input handling")
    print("="*50)

if __name__ == "__main__":
    main()