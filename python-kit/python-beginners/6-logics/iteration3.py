#!/usr/bin/env python3
"""
Iteration 3: Diamond Pyramid and Complex Geometric Patterns
===========================================================
This program creates sophisticated diamond patterns and pyramid structures.
Focus: Complex symmetry, multi-dimensional thinking, and advanced algorithms.
"""

def draw_diamond_basic(size):
    """Draw a basic diamond shape"""
    print(f"\n--- Basic Diamond (Size: {size}) ---")
    
    # Top half (including middle)
    for i in range(size):
        spaces = " " * (size - i - 1)
        stars = "*" * (2 * i + 1)
        print(spaces + stars)
    
    # Bottom half
    for i in range(size - 2, -1, -1):
        spaces = " " * (size - i - 1)
        stars = "*" * (2 * i + 1)
        print(spaces + stars)

def draw_diamond_hollow(size):
    """Draw a hollow diamond (outline only)"""
    print(f"\n--- Hollow Diamond (Size: {size}) ---")
    
    # Top half
    for i in range(size):
        spaces_before = " " * (size - i - 1)
        
        if i == 0:
            # Top point
            print(spaces_before + "*")
        else:
            # Hollow sides
            spaces_inside = " " * (2 * i - 1)
            print(spaces_before + "*" + spaces_inside + "*")
    
    # Bottom half
    for i in range(size - 2, -1, -1):
        spaces_before = " " * (size - i - 1)
        
        if i == 0:
            # Bottom point
            print(spaces_before + "*")
        else:
            # Hollow sides
            spaces_inside = " " * (2 * i - 1)
            print(spaces_before + "*" + spaces_inside + "*")

def draw_diamond_with_numbers(size):
    """Draw a diamond with numbers showing row position"""
    print(f"\n--- Diamond with Numbers (Size: {size}) ---")
    
    # Top half
    for i in range(size):
        spaces = " " * (size - i - 1)
        numbers = " ".join(str((i + 1) % 10) for _ in range(i + 1))
        print(spaces + numbers)
    
    # Bottom half
    for i in range(size - 2, -1, -1):
        spaces = " " * (size - i - 1)
        numbers = " ".join(str((i + 1) % 10) for _ in range(i + 1))
        print(spaces + numbers)

def draw_pyramid_3d_effect(height):
    """Draw a pyramid with 3D visual effect"""
    print(f"\n--- 3D Pyramid Effect (Height: {height}) ---")
    
    for i in range(height):
        # Left side spacing
        left_spaces = " " * (height - i - 1)
        
        # Create 3D effect with different characters
        if i == 0:
            pattern = "▲"
        else:
            # Use different characters for 3D effect
            left_side = "/" * i
            top = "_" * (i * 2)
            right_side = "\\" * i
            pattern = left_side + top + right_side
        
        print(left_spaces + pattern)
    
    # Base of pyramid
    base_width = height * 4 - 1
    print("-" * base_width)

def draw_diamond_pyramid_combined(size):
    """Draw a complex pattern combining diamond and pyramid concepts"""
    print(f"\n--- Diamond-Pyramid Combination (Size: {size}) ---")
    
    # Top pyramid section
    for i in range(size):
        spaces = " " * (size - i - 1)
        if i == 0:
            stars = "★"
        else:
            # Alternating pattern
            pattern = "◆" if i % 2 == 1 else "♦"
            stars = pattern * (2 * i + 1)
        print(spaces + stars)
    
    # Middle connector
    connector_spaces = " " * (size - 1)
    print(connector_spaces + "║")
    
    # Bottom inverted pyramid
    for i in range(size - 1, 0, -1):
        spaces = " " * (size - i)
        pattern = "▼" if i % 2 == 1 else "▽"
        stars = pattern * (2 * i - 1)
        print(spaces + stars)

def draw_fractal_triangle(depth, size=8):
    """Draw a simple fractal-like triangle pattern"""
    print(f"\n--- Fractal Triangle (Depth: {depth}, Size: {size}) ---")
    
    def draw_triangle_at_level(level, start_row, start_col, current_size):
        if level == 0 or current_size < 1:
            return
        
        # This is a simplified fractal representation
        for i in range(current_size):
            spaces = " " * (start_col + current_size - i - 1)
            if level == depth:  # Base level
                stars = "●" * (2 * i + 1)
            else:  # Higher levels
                stars = "○" * (2 * i + 1)
            print(spaces + stars)
        
        # Recursive calls for smaller triangles (simplified)
        if level > 1:
            new_size = current_size // 2
            if new_size > 0:
                draw_triangle_at_level(level - 1, start_row + current_size, 
                                     start_col - new_size, new_size)
    
    draw_triangle_at_level(depth, 0, size, size)

def animated_diamond_growth():
    """Simulate animated diamond growth (step by step)"""
    print("\n--- Animated Diamond Growth ---")
    
    max_size = 5
    print("Simulating diamond growth animation:")
    
    for current_size in range(1, max_size + 1):
        print(f"\nStep {current_size}:")
        
        # Top half
        for i in range(current_size):
            spaces = " " * (max_size - i - 1)
            stars = "✦" * (2 * i + 1)
            print(spaces + stars)
        
        # Bottom half
        for i in range(current_size - 2, -1, -1):
            spaces = " " * (max_size - i - 1)
            stars = "✦" * (2 * i + 1)
            print(spaces + stars)
        
        if current_size < max_size:
            print("  ⬇️  Growing...")

def diamond_mathematics():
    """Explore mathematical properties of diamond patterns"""
    print("\n" + "="*50)
    print("DIAMOND MATHEMATICS")
    print("="*50)
    
    try:
        size = int(input("Enter diamond size (3-8): "))
        if size < 3 or size > 8:
            print("Please enter a size between 3 and 8")
            return
        
        # Calculate properties
        total_rows = 2 * size - 1
        max_width = 2 * size - 1
        total_stars = size * size + (size - 1) * (size - 1)
        
        print(f"\nDiamond Properties (Size {size}):")
        print(f"Total rows: {total_rows}")
        print(f"Maximum width: {max_width}")
        print(f"Total stars in solid diamond: {total_stars}")
        print(f"Stars in hollow diamond: {4 * (size - 1) + 1}")
        
        # Show both versions
        draw_diamond_basic(size)
        draw_diamond_hollow(size)
        
    except ValueError:
        print("Please enter a valid number!")

def pattern_challenge():
    """Interactive pattern creation challenge"""
    print("\n" + "="*50)
    print("DIAMOND PATTERN CHALLENGE")
    print("="*50)
    
    challenges = [
        ("Create a diamond with alternating symbols", "Use different symbols for each row"),
        ("Make a diamond that changes size", "Start small, grow, then shrink"),
        ("Design a double diamond", "Two diamonds side by side"),
        ("Create a diamond maze", "Hollow diamond with internal pattern")
    ]
    
    print("Choose a challenge:")
    for i, (title, description) in enumerate(challenges, 1):
        print(f"{i}. {title}: {description}")
    
    try:
        choice = int(input("\nEnter your choice (1-4): "))
        if 1 <= choice <= 4:
            title, description = challenges[choice - 1]
            print(f"\nChallenge: {title}")
            print(f"Goal: {description}")
            
            if choice == 1:
                # Alternating symbols diamond
                size = 5
                symbols = ["★", "☆", "✦", "✧", "◆"]
                print(f"\nSolution (Size {size}):")
                for i in range(size):
                    spaces = " " * (size - i - 1)
                    symbol = symbols[i % len(symbols)]
                    stars = symbol * (2 * i + 1)
                    print(spaces + stars)
                for i in range(size - 2, -1, -1):
                    spaces = " " * (size - i - 1)
                    symbol = symbols[i % len(symbols)]
                    stars = symbol * (2 * i + 1)
                    print(spaces + stars)
            
            # Add more solutions for other challenges...
            
        else:
            print("Invalid choice!")
            
    except ValueError:
        print("Please enter a valid number!")

def main():
    """Main function demonstrating diamond and pyramid patterns"""
    print("Iteration 3: Diamond Pyramid and Complex Geometric Patterns")
    print("This program explores advanced symmetrical patterns and geometric shapes.\n")
    
    # Demonstrate various diamond and pyramid patterns
    draw_diamond_basic(5)
    draw_diamond_hollow(5)
    draw_diamond_with_numbers(4)
    draw_pyramid_3d_effect(5)
    draw_diamond_pyramid_combined(4)
    draw_fractal_triangle(3, 6)
    animated_diamond_growth()
    
    # Interactive sections
    diamond_mathematics()
    pattern_challenge()
    
    print("\n" + "="*60)
    print("Key Learning Points:")
    print("1. Complex symmetrical pattern creation")
    print("2. Multi-dimensional thinking in ASCII art")
    print("3. Mathematical relationships in geometric shapes")
    print("4. Algorithm design for complex patterns")
    print("5. Recursive and fractal-like structures")
    print("6. Animation simulation through step-by-step display")
    print("="*60)

if __name__ == "__main__":
    main()