#!/usr/bin/env python3
"""
Vulnerable Flask Application - Version 1
========================================
This Flask application intentionally contains common security vulnerabilities
for educational purposes. This demonstrates real-world security issues.

⚠️  WARNING: This application contains intentional vulnerabilities!
    - Only run in a secure, isolated environment
    - Never deploy this to production
    - Use only for educational security testing

Vulnerabilities included:
1. SQL Injection
2. Cross-Site Scripting (XSS)
3. Insecure Direct Object References
4. Missing Authentication
5. Command Injection
6. Path Traversal
"""

from flask import Flask, request, render_template_string, redirect, url_for, session
import sqlite3
import os
import subprocess
import hashlib

app = Flask(__name__)
app.secret_key = 'weak_secret_key_123'  # Vulnerability: Weak secret key

# Initialize database
def init_db():
    """Initialize the vulnerable database"""
    conn = sqlite3.connect('vulnerable_app.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            role TEXT DEFAULT 'user'
        )
    ''')
    
    # Products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL,
            description TEXT
        )
    ''')
    
    # Messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert sample data
    cursor.execute("DELETE FROM users")  # Clear existing data
    sample_users = [
        (1, 'admin', 'admin123', 'admin@example.com', 'admin'),
        (2, 'john', 'password', 'john@example.com', 'user'),
        (3, 'alice', 'secret', 'alice@example.com', 'user'),
    ]
    cursor.executemany('INSERT INTO users VALUES (?, ?, ?, ?, ?)', sample_users)
    
    cursor.execute("DELETE FROM products")
    sample_products = [
        (1, 'Laptop', 999.99, 'High-performance laptop'),
        (2, 'Phone', 599.99, 'Latest smartphone'),
        (3, 'Tablet', 399.99, 'Portable tablet'),
    ]
    cursor.executemany('INSERT INTO products VALUES (?, ?, ?, ?)', sample_products)
    
    conn.commit()
    conn.close()

@app.route('/')
def home():
    """Home page with navigation"""
    html = '''
    <html>
    <head>
        <title>Vulnerable Web App - Security Testing Lab</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            .vulnerability { background: #ffebee; padding: 20px; margin: 10px 0; border-left: 4px solid #f44336; }
            .nav { background: #2196F3; padding: 10px; margin-bottom: 20px; }
            .nav a { color: white; text-decoration: none; margin-right: 20px; }
            .warning { background: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="warning">
                <h3>⚠️  Security Testing Lab - Version 1 (Vulnerable)</h3>
                <p>This application contains intentional vulnerabilities for educational purposes.</p>
                <p><strong>DO NOT</strong> deploy this to production environments!</p>
            </div>
            
            <div class="nav">
                <a href="/">Home</a>
                <a href="/login">Login</a>
                <a href="/search">Search Products</a>
                <a href="/profile/1">User Profile</a>
                <a href="/messages">Messages</a>
                <a href="/files">File Manager</a>
                <a href="/admin">Admin Panel</a>
            </div>
            
            <h1>Welcome to the Security Testing Lab</h1>
            
            <div class="vulnerability">
                <h3>🎯 Testing Challenges Available:</h3>
                <ul>
                    <li><strong>SQL Injection:</strong> Try the login and search features</li>
                    <li><strong>XSS:</strong> Test message posting and search functionality</li>
                    <li><strong>IDOR:</strong> Manipulate user profile URLs</li>
                    <li><strong>Command Injection:</strong> Use the admin ping feature</li>
                    <li><strong>Path Traversal:</strong> Test the file manager</li>
                </ul>
            </div>
            
            <h3>Quick Test Examples:</h3>
            <ul>
                <li><code>admin' OR '1'='1</code> - Try this in login</li>
                <li><code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code> - Try this in search</li>
                <li><code>/profile/2</code> - Access other user profiles</li>
                <li><code>../../../etc/passwd</code> - Try in file manager</li>
            </ul>
        </div>
    </body>
    </html>
    '''
    return html

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Vulnerable login with SQL injection"""
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # VULNERABILITY: SQL Injection
        conn = sqlite3.connect('vulnerable_app.db')
        cursor = conn.cursor()
        
        # Dangerous query - directly inserting user input
        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
        print(f"🚨 Executing query: {query}")  # For debugging
        
        try:
            cursor.execute(query)
            user = cursor.fetchone()
            conn.close()
            
            if user:
                session['user_id'] = user[0]
                session['username'] = user[1]
                session['role'] = user[4]
                return f"<h2>✅ Login successful! Welcome {user[1]}</h2><p>Role: {user[4]}</p><a href='/'>Home</a>"
            else:
                return "<h2>❌ Login failed!</h2><a href='/login'>Try again</a>"
                
        except Exception as e:
            return f"<h2>💥 Database Error:</h2><p>{str(e)}</p><a href='/login'>Back</a>"
    
    # GET request - show login form
    html = '''
    <html>
    <body style="font-family: Arial; margin: 40px;">
        <h2>Login (Vulnerable to SQL Injection)</h2>
        <div style="background: #ffebee; padding: 15px; margin-bottom: 20px;">
            <strong>🎯 Try SQL Injection:</strong><br>
            Username: <code>admin' OR '1'='1</code><br>
            Password: <code>anything</code>
        </div>
        
        <form method="post">
            <div style="margin-bottom: 15px;">
                <label>Username:</label><br>
                <input type="text" name="username" required style="width: 300px; padding: 8px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Password:</label><br>
                <input type="password" name="password" required style="width: 300px; padding: 8px;">
            </div>
            <button type="submit" style="padding: 10px 20px;">Login</button>
        </form>
        
        <p><a href="/">← Back to Home</a></p>
        
        <div style="background: #e8f5e8; padding: 15px; margin-top: 20px;">
            <h4>Valid Test Accounts:</h4>
            <ul>
                <li>admin / admin123</li>
                <li>john / password</li>
                <li>alice / secret</li>
            </ul>
        </div>
    </body>
    </html>
    '''
    return html

@app.route('/search')
def search():
    """Vulnerable search with XSS and SQL injection"""
    query = request.args.get('q', '')
    
    if query:
        # VULNERABILITY: SQL Injection in search
        conn = sqlite3.connect('vulnerable_app.db')
        cursor = conn.cursor()
        
        sql_query = f"SELECT * FROM products WHERE name LIKE '%{query}%' OR description LIKE '%{query}%'"
        print(f"🚨 Search query: {sql_query}")
        
        try:
            cursor.execute(sql_query)
            results = cursor.fetchall()
            conn.close()
            
            # VULNERABILITY: XSS - directly inserting user input into HTML
            results_html = f"<h3>Search results for: {query}</h3>"
            
            if results:
                results_html += "<ul>"
                for product in results:
                    results_html += f"<li><strong>{product[1]}</strong> - ${product[2]} - {product[3]}</li>"
                results_html += "</ul>"
            else:
                results_html += f"<p>No results found for '{query}'</p>"
                
        except Exception as e:
            results_html = f"<p style='color: red;'>Error: {str(e)}</p>"
    else:
        results_html = "<p>Enter a search term above.</p>"
    
    html = f'''
    <html>
    <body style="font-family: Arial; margin: 40px;">
        <h2>Product Search (Vulnerable to XSS & SQL Injection)</h2>
        
        <div style="background: #ffebee; padding: 15px; margin-bottom: 20px;">
            <strong>🎯 Try These Attacks:</strong><br>
            <strong>XSS:</strong> <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code><br>
            <strong>SQL Injection:</strong> <code>' UNION SELECT 1,username,password,email FROM users--</code>
        </div>
        
        <form method="get">
            <input type="text" name="q" value="{query}" placeholder="Search products..." 
                   style="width: 400px; padding: 8px;">
            <button type="submit" style="padding: 8px 15px;">Search</button>
        </form>
        
        <div style="margin-top: 20px;">
            {results_html}
        </div>
        
        <p><a href="/">← Back to Home</a></p>
    </body>
    </html>
    '''
    return html

@app.route('/profile/<int:user_id>')
def profile(user_id):
    """Vulnerable user profile - Insecure Direct Object Reference"""
    # VULNERABILITY: No authorization check - any user can view any profile
    
    conn = sqlite3.connect('vulnerable_app.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        html = f'''
        <html>
        <body style="font-family: Arial; margin: 40px;">
            <h2>User Profile (Vulnerable to IDOR)</h2>
            
            <div style="background: #ffebee; padding: 15px; margin-bottom: 20px;">
                <strong>🎯 Try IDOR Attack:</strong><br>
                Change the URL to <code>/profile/2</code> or <code>/profile/3</code> to access other users' profiles!
            </div>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
                <h3>Profile Information</h3>
                <p><strong>ID:</strong> {user[0]}</p>
                <p><strong>Username:</strong> {user[1]}</p>
                <p><strong>Password:</strong> {user[2]} (⚠️ Exposed!)</p>
                <p><strong>Email:</strong> {user[3]}</p>
                <p><strong>Role:</strong> {user[4]}</p>
            </div>
            
            <p><a href="/">← Back to Home</a></p>
        </body>
        </html>
        '''
        return html
    else:
        return "<h2>User not found</h2><a href='/'>Home</a>"

@app.route('/messages', methods=['GET', 'POST'])
def messages():
    """Vulnerable message system with XSS"""
    if request.method == 'POST':
        message = request.form.get('message', '')
        user_id = session.get('user_id', 1)  # Default to user 1 if not logged in
        
        # Store message in database
        conn = sqlite3.connect('vulnerable_app.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO messages (user_id, message) VALUES (?, ?)", (user_id, message))
        conn.commit()
        conn.close()
    
    # Get all messages
    conn = sqlite3.connect('vulnerable_app.db')
    cursor = conn.cursor()
    cursor.execute("""
        SELECT m.message, u.username, m.created_at 
        FROM messages m 
        JOIN users u ON m.user_id = u.id 
        ORDER BY m.created_at DESC
    """)
    messages = cursor.fetchall()
    conn.close()
    
    # VULNERABILITY: XSS - directly rendering user input
    message_html = ""
    for msg in messages:
        message_html += f'''
        <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
            <strong>{msg[1]}:</strong> {msg[0]}
            <small style="color: #666;">{msg[2]}</small>
        </div>
        '''
    
    html = f'''
    <html>
    <body style="font-family: Arial; margin: 40px;">
        <h2>Message Board (Vulnerable to XSS)</h2>
        
        <div style="background: #ffebee; padding: 15px; margin-bottom: 20px;">
            <strong>🎯 Try XSS Attack:</strong><br>
            Post: <code>&lt;script&gt;alert('XSS Attack!')&lt;/script&gt;</code><br>
            Or: <code>&lt;img src=x onerror=alert('XSS')&gt;</code>
        </div>
        
        <form method="post">
            <div style="margin-bottom: 15px;">
                <label>Post a message:</label><br>
                <textarea name="message" rows="3" cols="50" placeholder="Enter your message..."></textarea>
            </div>
            <button type="submit" style="padding: 8px 15px;">Post Message</button>
        </form>
        
        <h3>Recent Messages:</h3>
        {message_html if message_html else "<p>No messages yet.</p>"}
        
        <p><a href="/">← Back to Home</a></p>
    </body>
    </html>
    '''
    return html

@app.route('/admin')
def admin():
    """Vulnerable admin panel with command injection"""
    html = '''
    <html>
    <body style="font-family: Arial; margin: 40px;">
        <h2>Admin Panel (Vulnerable to Command Injection)</h2>
        
        <div style="background: #ffebee; padding: 15px; margin-bottom: 20px;">
            <strong>🎯 Try Command Injection:</strong><br>
            Host: <code>127.0.0.1; ls -la</code><br>
            Or: <code>8.8.8.8 && whoami</code><br>
            Or: <code>google.com | cat /etc/passwd</code>
        </div>
        
        <h3>Network Diagnostics</h3>
        <form action="/ping" method="post">
            <div style="margin-bottom: 15px;">
                <label>Host to ping:</label><br>
                <input type="text" name="host" placeholder="e.g., google.com" 
                       style="width: 300px; padding: 8px;">
            </div>
            <button type="submit" style="padding: 8px 15px;">Ping Host</button>
        </form>
        
        <p><a href="/">← Back to Home</a></p>
    </body>
    </html>
    '''
    return html

@app.route('/ping', methods=['POST'])
def ping():
    """Vulnerable ping function with command injection"""
    host = request.form.get('host', '')
    
    if host:
        # VULNERABILITY: Command Injection
        command = f"ping -c 4 {host}"
        print(f"🚨 Executing command: {command}")
        
        try:
            # Dangerous - directly executing user input
            result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=10)
            output = result.stdout + result.stderr
        except subprocess.TimeoutExpired:
            output = "Command timed out"
        except Exception as e:
            output = f"Error: {str(e)}"
    else:
        output = "No host specified"
    
    html = f'''
    <html>
    <body style="font-family: Arial; margin: 40px;">
        <h2>Ping Results</h2>
        <h3>Command: ping -c 4 {host}</h3>
        <pre style="background: #f5f5f5; padding: 15px; overflow-x: auto;">{output}</pre>
        <p><a href="/admin">← Back to Admin</a></p>
    </body>
    </html>
    '''
    return html

@app.route('/files')
def files():
    """Vulnerable file manager with path traversal"""
    filename = request.args.get('file', '')
    
    content = ""
    if filename:
        try:
            # VULNERABILITY: Path Traversal
            file_path = f"uploads/{filename}"
            print(f"🚨 Attempting to read file: {file_path}")
            
            with open(file_path, 'r') as f:
                content = f.read()
                
        except Exception as e:
            content = f"Error reading file: {str(e)}"
    
    html = f'''
    <html>
    <body style="font-family: Arial; margin: 40px;">
        <h2>File Manager (Vulnerable to Path Traversal)</h2>
        
        <div style="background: #ffebee; padding: 15px; margin-bottom: 20px;">
            <strong>🎯 Try Path Traversal:</strong><br>
            <code>../../../etc/passwd</code><br>
            <code>../../../etc/hosts</code><br>
            <code>../../app.py</code>
        </div>
        
        <form method="get">
            <div style="margin-bottom: 15px;">
                <label>File to read:</label><br>
                <input type="text" name="file" value="{filename}" 
                       placeholder="e.g., test.txt" style="width: 400px; padding: 8px;">
            </div>
            <button type="submit" style="padding: 8px 15px;">Read File</button>
        </form>
        
        {f'<h3>File Content:</h3><pre style="background: #f5f5f5; padding: 15px; overflow-x: auto;">{content}</pre>' if content else ''}
        
        <p><a href="/">← Back to Home</a></p>
    </body>
    </html>
    '''
    return html

if __name__ == '__main__':
    # Create uploads directory and sample files
    os.makedirs('uploads', exist_ok=True)
    
    # Create sample files
    with open('uploads/test.txt', 'w') as f:
        f.write("This is a test file.\nYou successfully accessed the file system!")
    
    with open('uploads/readme.txt', 'w') as f:
        f.write("README\n=====\nThis is the uploads directory.\nContains user uploaded files.")
    
    # Initialize database
    init_db()
    
    print("🚨 Starting VULNERABLE Flask Application")
    print("⚠️  WARNING: This application contains intentional security vulnerabilities!")
    print("🔒 Only run in a secure, isolated environment")
    print("🌐 Access at: http://localhost:5000")
    print("📝 Check the home page for testing instructions")
    
    app.run(debug=True, host='0.0.0.0', port=6000)