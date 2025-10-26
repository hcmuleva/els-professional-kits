#!/usr/bin/env python3
"""
Iteration 5: Master Challenge - Complex System Design
=====================================================
This program implements a complex system combining multiple advanced concepts.
Focus: System architecture, data structures, and real-world problem solving.
"""

class GameOfLife:
    """Conway's Game of Life - A cellular automaton simulation"""
    
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.grid = [[0 for _ in range(width)] for _ in range(height)]
        self.generation = 0
    
    def set_pattern(self, pattern_name):
        """Set a predefined pattern"""
        self.clear_grid()
        
        patterns = {
            'glider': [(1, 2), (2, 3), (3, 1), (3, 2), (3, 3)],
            'blinker': [(2, 1), (2, 2), (2, 3)],
            'block': [(1, 1), (1, 2), (2, 1), (2, 2)],
            'toad': [(2, 2), (2, 3), (2, 4), (3, 1), (3, 2), (3, 3)]
        }
        
        if pattern_name in patterns:
            for x, y in patterns[pattern_name]:
                if 0 <= x < self.height and 0 <= y < self.width:
                    self.grid[x][y] = 1
    
    def clear_grid(self):
        """Clear the grid"""
        self.grid = [[0 for _ in range(self.width)] for _ in range(self.height)]
        self.generation = 0
    
    def count_neighbors(self, x, y):
        """Count live neighbors around a cell"""
        count = 0
        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                if dx == 0 and dy == 0:
                    continue
                nx, ny = x + dx, y + dy
                if 0 <= nx < self.height and 0 <= ny < self.width:
                    count += self.grid[nx][ny]
        return count
    
    def next_generation(self):
        """Calculate and update to next generation"""
        new_grid = [[0 for _ in range(self.width)] for _ in range(self.height)]
        
        for x in range(self.height):
            for y in range(self.width):
                neighbors = self.count_neighbors(x, y)
                
                if self.grid[x][y] == 1:  # Living cell
                    if neighbors in [2, 3]:
                        new_grid[x][y] = 1  # Survives
                else:  # Dead cell
                    if neighbors == 3:
                        new_grid[x][y] = 1  # Birth
        
        self.grid = new_grid
        self.generation += 1
    
    def display(self):
        """Display the current grid"""
        print(f"\nGeneration {self.generation}:")
        print("+" + "-" * self.width + "+")
        for row in self.grid:
            print("|" + "".join("█" if cell else " " for cell in row) + "|")
        print("+" + "-" * self.width + "+")
        
        # Statistics
        live_cells = sum(sum(row) for row in self.grid)
        print(f"Live cells: {live_cells}")

class DataStructureVisualizer:
    """Visualize different data structures and their operations"""
    
    @staticmethod
    def visualize_binary_tree():
        """Create and visualize a binary tree"""
        print("\n--- Binary Tree Visualization ---")
        
        class TreeNode:
            def __init__(self, val=0, left=None, right=None):
                self.val = val
                self.left = left
                self.right = right
        
        # Create a sample binary tree
        root = TreeNode(1)
        root.left = TreeNode(2)
        root.right = TreeNode(3)
        root.left.left = TreeNode(4)
        root.left.right = TreeNode(5)
        root.right.left = TreeNode(6)
        root.right.right = TreeNode(7)
        
        def print_tree(node, level=0, prefix="Root: "):
            if node is not None:
                print(" " * (level * 4) + prefix + str(node.val))
                if node.left is not None or node.right is not None:
                    if node.left:
                        print_tree(node.left, level + 1, "L--- ")
                    else:
                        print(" " * ((level + 1) * 4) + "L--- None")
                    if node.right:
                        print_tree(node.right, level + 1, "R--- ")
                    else:
                        print(" " * ((level + 1) * 4) + "R--- None")
        
        print_tree(root)
        
        # Tree traversals
        def inorder(node, result):
            if node:
                inorder(node.left, result)
                result.append(node.val)
                inorder(node.right, result)
        
        def preorder(node, result):
            if node:
                result.append(node.val)
                preorder(node.left, result)
                preorder(node.right, result)
        
        def postorder(node, result):
            if node:
                postorder(node.left, result)
                postorder(node.right, result)
                result.append(node.val)
        
        inorder_result = []
        preorder_result = []
        postorder_result = []
        
        inorder(root, inorder_result)
        preorder(root, preorder_result)
        postorder(root, postorder_result)
        
        print(f"\nTraversals:")
        print(f"Inorder:   {inorder_result}")
        print(f"Preorder:  {preorder_result}")
        print(f"Postorder: {postorder_result}")
    
    @staticmethod
    def visualize_graph_algorithms():
        """Demonstrate graph algorithms"""
        print("\n--- Graph Algorithms Visualization ---")
        
        # Adjacency list representation
        graph = {
            'A': ['B', 'C'],
            'B': ['A', 'D', 'E'],
            'C': ['A', 'F'],
            'D': ['B'],
            'E': ['B', 'F'],
            'F': ['C', 'E']
        }
        
        print("Graph structure:")
        for node, neighbors in graph.items():
            print(f"{node}: {neighbors}")
        
        def bfs(graph, start):
            visited = set()
            queue = [start]
            path = []
            
            while queue:
                node = queue.pop(0)
                if node not in visited:
                    visited.add(node)
                    path.append(node)
                    queue.extend([n for n in graph[node] if n not in visited])
            
            return path
        
        def dfs(graph, start, visited=None, path=None):
            if visited is None:
                visited = set()
            if path is None:
                path = []
            
            visited.add(start)
            path.append(start)
            
            for neighbor in graph[start]:
                if neighbor not in visited:
                    dfs(graph, neighbor, visited, path)
            
            return path
        
        bfs_path = bfs(graph, 'A')
        dfs_path = dfs(graph, 'A')
        
        print(f"\nBFS traversal from A: {bfs_path}")
        print(f"DFS traversal from A: {dfs_path}")

class AlgorithmicPuzzleSolver:
    """Solve complex algorithmic puzzles"""
    
    @staticmethod
    def solve_knapsack_problem():
        """Solve 0/1 Knapsack problem using dynamic programming"""
        print("\n--- 0/1 Knapsack Problem ---")
        
        # Items: (weight, value, name)
        items = [
            (10, 60, "Item A"),
            (20, 100, "Item B"),
            (30, 120, "Item C")
        ]
        capacity = 50
        
        print(f"Knapsack capacity: {capacity}")
        print("Available items:")
        for weight, value, name in items:
            print(f"  {name}: weight={weight}, value={value}, ratio={value/weight:.2f}")
        
        n = len(items)
        
        # Create DP table
        dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]
        
        # Fill DP table
        for i in range(1, n + 1):
            weight, value, name = items[i-1]
            for w in range(capacity + 1):
                if weight <= w:
                    dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight] + value)
                else:
                    dp[i][w] = dp[i-1][w]
        
        # Backtrack to find selected items
        selected_items = []
        w = capacity
        for i in range(n, 0, -1):
            if dp[i][w] != dp[i-1][w]:
                selected_items.append(items[i-1])
                w -= items[i-1][0]
        
        print(f"\nOptimal solution:")
        print(f"Maximum value: {dp[n][capacity]}")
        print("Selected items:")
        total_weight = 0
        for weight, value, name in selected_items:
            print(f"  {name}: weight={weight}, value={value}")
            total_weight += weight
        print(f"Total weight: {total_weight}/{capacity}")
    
    @staticmethod
    def solve_traveling_salesman():
        """Solve small TSP using brute force approach"""
        print("\n--- Traveling Salesman Problem (4 cities) ---")
        
        # Distance matrix
        cities = ['A', 'B', 'C', 'D']
        distances = [
            [0, 10, 15, 20],
            [10, 0, 35, 25],
            [15, 35, 0, 30],
            [20, 25, 30, 0]
        ]
        
        print("Distance matrix:")
        print("    " + "  ".join(f"{city:2s}" for city in cities))
        for i, city in enumerate(cities):
            row = "  ".join(f"{dist:2d}" for dist in distances[i])
            print(f"{city}: {row}")
        
        from itertools import permutations
        
        def calculate_tour_distance(tour):
            total = 0
            for i in range(len(tour)):
                total += distances[tour[i]][tour[(i + 1) % len(tour)]]
            return total
        
        # Generate all possible tours (starting from city 0)
        other_cities = list(range(1, len(cities)))
        min_distance = float('inf')
        best_tour = None
        
        for perm in permutations(other_cities):
            tour = [0] + list(perm)
            distance = calculate_tour_distance(tour)
            if distance < min_distance:
                min_distance = distance
                best_tour = tour
        
        print(f"\nOptimal tour:")
        tour_cities = [cities[i] for i in best_tour] + [cities[best_tour[0]]]
        print(f"Route: {' -> '.join(tour_cities)}")
        print(f"Total distance: {min_distance}")

def fractal_tree_generator(depth=5):
    """Generate a fractal tree pattern"""
    print(f"\n--- Fractal Tree Generator (Depth: {depth}) ---")
    
    def draw_tree(x, y, length, angle, depth, grid):
        if depth == 0 or length < 1:
            return
        
        import math
        
        # Calculate end point
        end_x = x + length * math.cos(math.radians(angle))
        end_y = y + length * math.sin(math.radians(angle))
        
        # Draw line (simplified for ASCII)
        steps = int(length)
        for i in range(steps):
            curr_x = int(x + i * (end_x - x) / steps)
            curr_y = int(y + i * (end_y - y) / steps)
            
            if 0 <= curr_x < len(grid) and 0 <= curr_y < len(grid[0]):
                grid[curr_x][curr_y] = '*'
        
        # Recursive branches
        new_length = length * 0.7
        draw_tree(end_x, end_y, new_length, angle - 30, depth - 1, grid)
        draw_tree(end_x, end_y, new_length, angle + 30, depth - 1, grid)
    
    # Create grid for ASCII art
    grid_size = 40
    grid = [[' ' for _ in range(grid_size)] for _ in range(grid_size)]
    
    # Start drawing from bottom center
    start_x, start_y = grid_size - 5, grid_size // 2
    initial_length = 8
    initial_angle = 90  # Point upward
    
    draw_tree(start_x, start_y, initial_length, initial_angle, depth, grid)
    
    # Display grid
    for row in grid:
        print(''.join(row))
    
    print(f"\nFractal properties:")
    print(f"Depth: {depth}")
    print(f"Branch angle: 30 degrees")
    print(f"Length ratio: 0.7")
    print(f"Number of branches: {2**depth - 1}")

def chaos_theory_demo():
    """Demonstrate chaos theory with logistic map"""
    print("\n--- Chaos Theory: Logistic Map ---")
    
    def logistic_map(r, x):
        return r * x * (1 - x)
    
    # Different r values show different behaviors
    r_values = [1.5, 2.5, 3.2, 3.5, 3.8]
    
    for r in r_values:
        print(f"\nr = {r}:")
        x = 0.5  # Initial value
        
        # Show first 10 iterations
        iterations = []
        for i in range(10):
            x = logistic_map(r, x)
            iterations.append(x)
        
        print(f"Iterations: {[f'{val:.3f}' for val in iterations[:5]]}...")
        
        # Analyze behavior
        if r < 1:
            behavior = "Dies out (extinction)"
        elif r < 3:
            behavior = "Stable fixed point"
        elif r < 1 + math.sqrt(6):
            behavior = "Oscillating between two values"
        elif r < 3.57:
            behavior = "Complex periodic behavior"
        else:
            behavior = "Chaotic behavior"
        
        print(f"Behavior: {behavior}")

def main():
    """Main function demonstrating the master challenge"""
    print("Iteration 5: Master Challenge - Complex System Design")
    print("This program combines multiple advanced concepts into complex systems.\n")
    
    # Game of Life demonstration
    print("="*60)
    print("CONWAY'S GAME OF LIFE")
    print("="*60)
    
    game = GameOfLife(15, 8)
    game.set_pattern('glider')
    
    for generation in range(5):
        game.display()
        if generation < 4:
            input("Press Enter for next generation...")
            game.next_generation()
    
    # Data structure visualization
    print("\n" + "="*60)
    print("DATA STRUCTURE VISUALIZATION")
    print("="*60)
    
    visualizer = DataStructureVisualizer()
    visualizer.visualize_binary_tree()
    visualizer.visualize_graph_algorithms()
    
    # Algorithmic puzzles
    print("\n" + "="*60)
    print("ALGORITHMIC PUZZLE SOLVING")
    print("="*60)
    
    solver = AlgorithmicPuzzleSolver()
    solver.solve_knapsack_problem()
    solver.solve_traveling_salesman()
    
    # Advanced mathematical concepts
    print("\n" + "="*60)
    print("ADVANCED MATHEMATICAL CONCEPTS")
    print("="*60)
    
    fractal_tree_generator(4)
    chaos_theory_demo()
    
    print("\n" + "="*60)
    print("MASTER CHALLENGE COMPLETED!")
    print("="*60)
    print("Key Concepts Mastered:")
    print("1. Cellular automata and emergent behavior")
    print("2. Advanced data structures (trees, graphs)")
    print("3. Graph algorithms (BFS, DFS)")
    print("4. Dynamic programming (Knapsack)")
    print("5. Combinatorial optimization (TSP)")
    print("6. Fractal geometry and recursion")
    print("7. Chaos theory and nonlinear dynamics")
    print("8. System architecture and modular design")
    print("="*60)

if __name__ == "__main__":
    main()