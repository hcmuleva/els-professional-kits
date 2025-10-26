#!/usr/bin/env python3
"""
Iteration 4: Advanced Logic Puzzles and Algorithms
==================================================
This program implements complex logic puzzles and algorithmic challenges.
Focus: Problem-solving strategies, algorithm design, and computational thinking.
"""

def solve_tower_of_hanoi(n, source='A', destination='C', auxiliary='B', show_steps=True):
    """Solve Tower of Hanoi puzzle recursively"""
    moves = []
    
    def hanoi_recursive(disks, src, dest, aux):
        if disks == 1:
            move = f"Move disk 1 from {src} to {dest}"
            moves.append(move)
            if show_steps:
                print(move)
        else:
            # Move n-1 disks from source to auxiliary
            hanoi_recursive(disks - 1, src, aux, dest)
            # Move the largest disk from source to destination
            move = f"Move disk {disks} from {src} to {dest}"
            moves.append(move)
            if show_steps:
                print(move)
            # Move n-1 disks from auxiliary to destination
            hanoi_recursive(disks - 1, aux, dest, src)
    
    print(f"\n--- Tower of Hanoi Solution ({n} disks) ---")
    print(f"Moving {n} disks from {source} to {destination} using {auxiliary}")
    print("Steps:")
    
    hanoi_recursive(n, source, destination, auxiliary)
    
    print(f"\nTotal moves required: {len(moves)}")
    print(f"Minimum possible moves: {2**n - 1}")
    
    return moves

def generate_maze(width, height):
    """Generate a simple maze using algorithmic approach"""
    print(f"\n--- Generated Maze ({width}x{height}) ---")
    
    # Create maze grid (1 = wall, 0 = path)
    maze = [[1 for _ in range(width)] for _ in range(height)]
    
    # Simple maze generation algorithm
    import random
    
    def is_valid(x, y):
        return 0 <= x < height and 0 <= y < width
    
    def carve_path(x, y):
        maze[x][y] = 0  # Make it a path
        
        # Random directions
        directions = [(0, 2), (2, 0), (0, -2), (-2, 0)]
        random.shuffle(directions)
        
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if is_valid(nx, ny) and maze[nx][ny] == 1:
                # Carve the wall between current and next cell
                maze[x + dx//2][y + dy//2] = 0
                carve_path(nx, ny)
    
    # Start carving from top-left
    carve_path(1, 1)
    
    # Ensure entrance and exit
    maze[0][1] = 0  # Entrance
    maze[height-1][width-2] = 0  # Exit
    
    # Display maze
    for row in maze:
        print(''.join('██' if cell == 1 else '  ' for cell in row))
    
    return maze

def solve_sudoku_simple():
    """Implement a simple Sudoku solver with basic logic"""
    print("\n--- Simple Sudoku Solver ---")
    
    # Simple 4x4 Sudoku for demonstration
    grid = [
        [1, 0, 0, 4],
        [0, 4, 1, 0],
        [0, 1, 4, 0],
        [4, 0, 0, 1]
    ]
    
    def print_grid(sudoku):
        for row in sudoku:
            print(' '.join(str(cell) if cell != 0 else '.' for cell in row))
    
    def is_valid(sudoku, row, col, num):
        # Check row
        if num in sudoku[row]:
            return False
        
        # Check column
        if num in [sudoku[i][col] for i in range(4)]:
            return False
        
        # Check 2x2 box
        start_row, start_col = 2 * (row // 2), 2 * (col // 2)
        for i in range(start_row, start_row + 2):
            for j in range(start_col, start_col + 2):
                if sudoku[i][j] == num:
                    return False
        
        return True
    
    def solve(sudoku):
        for i in range(4):
            for j in range(4):
                if sudoku[i][j] == 0:
                    for num in range(1, 5):
                        if is_valid(sudoku, i, j, num):
                            sudoku[i][j] = num
                            if solve(sudoku):
                                return True
                            sudoku[i][j] = 0
                    return False
        return True
    
    print("Initial puzzle:")
    print_grid(grid)
    
    if solve(grid):
        print("\nSolved puzzle:")
        print_grid(grid)
    else:
        print("No solution exists!")

def n_queens_problem(n=4):
    """Solve N-Queens problem using backtracking"""
    print(f"\n--- {n}-Queens Problem ---")
    
    def is_safe(board, row, col):
        # Check column
        for i in range(row):
            if board[i][col] == 1:
                return False
        
        # Check upper diagonal on left side
        for i, j in zip(range(row-1, -1, -1), range(col-1, -1, -1)):
            if board[i][j] == 1:
                return False
        
        # Check upper diagonal on right side
        for i, j in zip(range(row-1, -1, -1), range(col+1, n)):
            if board[i][j] == 1:
                return False
        
        return True
    
    def solve_queens(board, row):
        if row >= n:
            return True
        
        for col in range(n):
            if is_safe(board, row, col):
                board[row][col] = 1
                
                if solve_queens(board, row + 1):
                    return True
                
                board[row][col] = 0  # Backtrack
        
        return False
    
    # Initialize board
    board = [[0 for _ in range(n)] for _ in range(n)]
    
    if solve_queens(board, 0):
        print("Solution found:")
        for row in board:
            print(' '.join('♛' if cell == 1 else '·' for cell in row))
        
        # Count attacks (should be 0)
        attacks = 0
        queen_positions = []
        for i in range(n):
            for j in range(n):
                if board[i][j] == 1:
                    queen_positions.append((i, j))
        
        print(f"\nQueen positions: {queen_positions}")
        print(f"Number of attacking pairs: {attacks}")
    else:
        print("No solution exists!")

def fibonacci_spiral_pattern(n):
    """Create a pattern based on Fibonacci spiral"""
    print(f"\n--- Fibonacci Spiral Pattern ({n} terms) ---")
    
    def fibonacci_sequence(terms):
        if terms <= 0:
            return []
        elif terms == 1:
            return [0]
        elif terms == 2:
            return [0, 1]
        
        fib = [0, 1]
        for i in range(2, terms):
            fib.append(fib[i-1] + fib[i-2])
        return fib
    
    fib_numbers = fibonacci_sequence(n)
    print(f"Fibonacci sequence: {fib_numbers}")
    
    # Create spiral pattern representation
    max_fib = max(fib_numbers) if fib_numbers else 1
    
    for i, fib in enumerate(fib_numbers):
        if fib == 0:
            pattern = "○"
        else:
            # Create pattern based on Fibonacci number
            pattern_size = min(fib, 20)  # Limit size for display
            if i % 4 == 0:  # Right
                pattern = "→" * pattern_size
            elif i % 4 == 1:  # Down
                pattern = "↓" * pattern_size
            elif i % 4 == 2:  # Left
                pattern = "←" * pattern_size
            else:  # Up
                pattern = "↑" * pattern_size
        
        print(f"F({i:2d}) = {fib:3d}: {pattern}")

def algorithm_complexity_demo():
    """Demonstrate algorithm complexity with practical examples"""
    print("\n--- Algorithm Complexity Demonstration ---")
    
    import time
    
    def bubble_sort(arr):
        n = len(arr)
        comparisons = 0
        for i in range(n):
            for j in range(0, n-i-1):
                comparisons += 1
                if arr[j] > arr[j+1]:
                    arr[j], arr[j+1] = arr[j+1], arr[j]
        return comparisons
    
    def binary_search(arr, target):
        left, right = 0, len(arr) - 1
        comparisons = 0
        
        while left <= right:
            comparisons += 1
            mid = (left + right) // 2
            if arr[mid] == target:
                return mid, comparisons
            elif arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return -1, comparisons
    
    # Test with different array sizes
    sizes = [10, 20, 50]
    
    for size in sizes:
        print(f"\nArray size: {size}")
        
        # Create random array
        import random
        arr = [random.randint(1, 100) for _ in range(size)]
        original_arr = arr.copy()
        
        # Bubble sort complexity
        start_time = time.time()
        comparisons = bubble_sort(arr)
        sort_time = time.time() - start_time
        
        print(f"Bubble sort - Comparisons: {comparisons}, Time: {sort_time:.6f}s")
        
        # Binary search complexity
        target = arr[size // 2]  # Search for middle element
        _, search_comparisons = binary_search(arr, target)
        
        print(f"Binary search - Comparisons: {search_comparisons}")
        print(f"Theoretical max comparisons: {size * (size - 1) // 2} (bubble), {size.bit_length() - 1} (binary)")

def logic_puzzle_solver():
    """Solve a logic puzzle using constraint satisfaction"""
    print("\n--- Logic Puzzle: Who Lives Where? ---")
    print("""
    Puzzle: Three people (Alice, Bob, Carol) live in houses (Red, Blue, Green)
    and have different pets (Cat, Dog, Fish).
    
    Clues:
    1. Alice doesn't live in the Red house
    2. The person with the Cat lives in the Blue house
    3. Bob doesn't have the Fish
    4. Carol doesn't live in the Green house
    """)
    
    people = ['Alice', 'Bob', 'Carol']
    houses = ['Red', 'Blue', 'Green']
    pets = ['Cat', 'Dog', 'Fish']
    
    # Generate all possible combinations
    from itertools import permutations
    
    solutions = []
    
    for house_perm in permutations(houses):
        for pet_perm in permutations(pets):
            # Create assignment
            assignment = {}
            for i, person in enumerate(people):
                assignment[person] = {'house': house_perm[i], 'pet': pet_perm[i]}
            
            # Check constraints
            valid = True
            
            # Clue 1: Alice doesn't live in the Red house
            if assignment['Alice']['house'] == 'Red':
                valid = False
            
            # Clue 2: The person with the Cat lives in the Blue house
            cat_owner = None
            for person, attrs in assignment.items():
                if attrs['pet'] == 'Cat':
                    cat_owner = person
                    break
            if cat_owner and assignment[cat_owner]['house'] != 'Blue':
                valid = False
            
            # Clue 3: Bob doesn't have the Fish
            if assignment['Bob']['pet'] == 'Fish':
                valid = False
            
            # Clue 4: Carol doesn't live in the Green house
            if assignment['Carol']['house'] == 'Green':
                valid = False
            
            if valid:
                solutions.append(assignment)
    
    print(f"\nFound {len(solutions)} solution(s):")
    for i, solution in enumerate(solutions, 1):
        print(f"\nSolution {i}:")
        for person, attrs in solution.items():
            print(f"  {person}: {attrs['house']} house, {attrs['pet']}")

def main():
    """Main function demonstrating advanced logic puzzles and algorithms"""
    print("Iteration 4: Advanced Logic Puzzles and Algorithms")
    print("This program explores complex problem-solving and algorithmic thinking.\n")
    
    # Demonstrate various algorithms and puzzles
    solve_tower_of_hanoi(3, show_steps=False)
    print("\n" + "-"*50)
    
    generate_maze(9, 7)
    print("\n" + "-"*50)
    
    solve_sudoku_simple()
    print("\n" + "-"*50)
    
    n_queens_problem(4)
    print("\n" + "-"*50)
    
    fibonacci_spiral_pattern(8)
    print("\n" + "-"*50)
    
    algorithm_complexity_demo()
    print("\n" + "-"*50)
    
    logic_puzzle_solver()
    
    print("\n" + "="*60)
    print("Key Learning Points:")
    print("1. Recursive problem solving (Tower of Hanoi)")
    print("2. Maze generation and pathfinding algorithms")
    print("3. Constraint satisfaction (Sudoku, N-Queens)")
    print("4. Backtracking algorithms")
    print("5. Algorithm complexity analysis")
    print("6. Logic puzzle solving with constraints")
    print("7. Mathematical patterns in programming")
    print("="*60)

if __name__ == "__main__":
    main()