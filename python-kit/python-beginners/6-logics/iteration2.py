#!/usr/bin/env python3
"""
Iteration 2: Equilateral Triangle and Advanced Patterns
======================================================
This program demonstrates more complex triangle patterns and mathematical concepts.
Focus: Mathematical precision, symmetry, and advanced pattern logic.
"""

import math

def draw_equilateral_triangle(side_length):
    """Draw an equilateral triangle using mathematical principles"""
    print(f"\n--- Equilateral Triangle (Side: {side_length}) ---")
    
    # For an equilateral triangle, height = side * sqrt(3) / 2
    # But for ASCII art, we'll use a simpler approach
    height = side_length
    
    for i in range(height):
        # Calculate spaces for perfect centering
        spaces = " " * (height - i - 1)
        
        # For equilateral triangle, each row has (2*i + 1) stars
        stars = "*" * (2 * i + 1)
        
        print(spaces + stars)

def draw_pascal_triangle(rows):
    """Draw Pascal's triangle with numbers"""
    print(f"\n--- Pascal's Triangle ({rows} rows) ---")
    
    # Generate Pascal's triangle
    triangle = []
    for i in range(rows):
        row = [1] * (i + 1)
        for j in range(1, i):
            row[j] = triangle[i-1][j-1] + triangle[i-1][j]
        triangle.append(row)
    
    # Display the triangle
    for i, row in enumerate(triangle):
        spaces = " " * (rows - i - 1) * 2
        numbers = "  ".join(f"{num:2d}" for num in row)
        print(spaces + numbers)

def draw_fibonacci_triangle(rows):
    """Draw a triangle using Fibonacci sequence"""
    print(f"\n--- Fibonacci Triangle ({rows} rows) ---")
    
    # Generate Fibonacci sequence
    def fibonacci(n):
        if n <= 1:
            return n
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b
    
    for i in range(1, rows + 1):
        spaces = " " * (rows - i) * 3
        fib_row = [fibonacci(j) for j in range(i)]
        numbers = "  ".join(f"{num:3d}" for num in fib_row)
        print(spaces + numbers)

def draw_star_pattern_advanced(size):
    """Draw an advanced star pattern with mathematical precision"""
    print(f"\n--- Advanced Star Pattern (Size: {size}) ---")
    
    for i in range(size):
        # Top half of the pattern
        spaces = " " * (size - i - 1)
        
        if i == 0:
            stars = "*"
        else:
            # Create a pattern with stars at specific positions
            pattern = "*" + " " * (2 * i - 1) + "*"
            stars = pattern
        
        print(spaces + stars)
    
    # Bottom half (mirror)
    for i in range(size - 2, -1, -1):
        spaces = " " * (size - i - 1)
        
        if i == 0:
            stars = "*"
        else:
            pattern = "*" + " " * (2 * i - 1) + "*"
            stars = pattern
        
        print(spaces + stars)

def draw_triangle_with_border(height):
    """Draw a triangle with decorative border"""
    print(f"\n--- Triangle with Border (Height: {height}) ---")
    
    # Top border
    border_width = 2 * height + 2
    print("+" + "-" * border_width + "+")
    
    # Triangle rows
    for i in range(height):
        spaces_before = " " * (height - i)
        stars = "*" * (2 * i + 1)
        spaces_after = " " * (height - i)
        print("|" + spaces_before + stars + spaces_after + "|")
    
    # Bottom border
    print("+" + "-" * border_width + "+")

def calculate_triangle_properties():
    """Calculate and display mathematical properties of triangles"""
    print("\n" + "="*50)
    print("TRIANGLE MATHEMATICS")
    print("="*50)
    
    try:
        side = float(input("Enter the side length of an equilateral triangle: "))
        
        # Equilateral triangle properties
        height = (side * math.sqrt(3)) / 2
        area = (math.sqrt(3) / 4) * (side ** 2)
        perimeter = 3 * side
        
        print(f"\nEquilateral Triangle Properties:")
        print(f"Side length: {side:.2f}")
        print(f"Height: {height:.2f}")
        print(f"Area: {area:.2f}")
        print(f"Perimeter: {perimeter:.2f}")
        
        # Draw proportional ASCII representation
        ascii_height = max(3, min(10, int(side)))
        print(f"\nASCII Representation (scaled to height {ascii_height}):")
        draw_equilateral_triangle(ascii_height)
        
    except ValueError:
        print("Please enter a valid number!")

def pattern_analyzer():
    """Analyze and explain different triangle patterns"""
    print("\n" + "="*50)
    print("PATTERN ANALYSIS")
    print("="*50)
    
    patterns = {
        "1": ("Right Triangle", "Stars increase by 1 each row"),
        "2": ("Equilateral", "Stars increase by 2, centered"),
        "3": ("Pascal", "Mathematical sequence relationships"),
        "4": ("Fibonacci", "Each row uses Fibonacci numbers"),
        "5": ("Hollow", "Only outline, mathematical spacing")
    }
    
    print("Available patterns:")
    for key, (name, description) in patterns.items():
        print(f"{key}. {name}: {description}")
    
    choice = input("\nChoose a pattern to analyze (1-5): ")
    
    if choice in patterns:
        name, description = patterns[choice]
        print(f"\nAnalyzing: {name}")
        print(f"Logic: {description}")
        
        if choice == "1":
            draw_equilateral_triangle(6)
        elif choice == "2":
            draw_pascal_triangle(6)
        elif choice == "3":
            draw_fibonacci_triangle(5)
        elif choice == "4":
            draw_star_pattern_advanced(5)
        elif choice == "5":
            draw_triangle_with_border(5)
    else:
        print("Invalid choice!")

def main():
    """Main function demonstrating advanced triangle patterns"""
    print("Iteration 2: Equilateral Triangle and Advanced Patterns")
    print("This program explores mathematical precision in pattern creation.\n")
    
    # Demonstrate various advanced patterns
    draw_equilateral_triangle(7)
    draw_pascal_triangle(6)
    draw_fibonacci_triangle(5)
    draw_star_pattern_advanced(5)
    draw_triangle_with_border(6)
    
    # Interactive sections
    calculate_triangle_properties()
    pattern_analyzer()
    
    print("\n" + "="*60)
    print("Key Learning Points:")
    print("1. Mathematical relationships in patterns")
    print("2. Fibonacci and Pascal sequences")
    print("3. Advanced loop control and spacing")
    print("4. Mathematical calculations in programming")
    print("5. Pattern symmetry and geometric principles")
    print("="*60)

if __name__ == "__main__":
    main()