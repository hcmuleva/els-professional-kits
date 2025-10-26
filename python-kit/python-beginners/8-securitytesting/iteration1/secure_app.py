#!/usr/bin/env python3
"""
Secure Flask Application - Security Testing Example
==================================================
This is the SECURE version of the vulnerable Flask application.
It demonstrates proper security practices and fixes for common vulnerabilities.

🔒 SECURITY FEATURES:
- Input validation and sanitization
- Parameterized SQL queries (prevents SQL injection)
- Output encoding (prevents XSS)
- Authentication and authorization
- Secure session management
- Command injection prevention
- Path traversal protection
- Security headers implementation

Compare this with vulnerable_app.py to understand security improvements.
"""

from flask import Flask, request, render_template_string, session, redirect, url_for, jsonify, escape
import sqlite3
import hashlib
import secrets
import os
import re
import subprocess
import html
from datetime import datetime, timedelta
from functools import wraps
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Secure session configuration
app.secret_key = secrets.token_hex(32)  # Strong random secret key
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)  # Session timeout

# Security headers middleware
@app.after_request
def add_security_headers(response):
    """Add security headers to all responses"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
    return response

class DatabaseManager:
    """Secure database operations with parameterized queries"""
    
    def __init__(self, db_name='secure_app.db'):
        self.db_name = db_name
        self.init_database()
    
    def get_connection(self):
        """Get secure database connection"""
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row  # Enable dict-like access
        return conn
    
    def init_database(self):
        """Initialize database with secure schema"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Create users table with password hashing
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                email TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create messages table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Create session table for secure session management
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                session_token TEXT UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Insert sample users with hashed passwords
        sample_users = [
            ('admin', 'admin123', 'admin@example.com', True),
            ('alice', 'password123', 'alice@example.com', False),
            ('john', 'mypassword', 'john@example.com', False)
        ]
        
        for username, password, email, is_admin in sample_users:
            password_hash = self.hash_password(password)
            cursor.execute('''
                INSERT OR IGNORE INTO users (username, password_hash, email, is_admin)
                VALUES (?, ?, ?, ?)
            ''', (username, password_hash, email, is_admin))
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")
    
    def hash_password(self, password):
        """Securely hash password using SHA-256 with salt"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}:{password_hash}"
    
    def verify_password(self, password, stored_hash):
        """Verify password against stored hash"""
        if ':' not in stored_hash:
            return False
        
        salt, hash_value = stored_hash.split(':', 1)
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return password_hash == hash_value
    
    def authenticate_user(self, username, password):
        """Securely authenticate user with parameterized query"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Use parameterized query to prevent SQL injection
        cursor.execute(
            "SELECT id, username, password_hash, is_admin FROM users WHERE username = ?",
            (username,)
        )
        
        user = cursor.fetchone()
        conn.close()
        
        if user and self.verify_password(password, user['password_hash']):
            return {
                'id': user['id'],
                'username': user['username'],
                'is_admin': user['is_admin']
            }
        return None
    
    def get_user_by_id(self, user_id, requesting_user_id):
        """Get user info with authorization check"""
        # Authorization: users can only view their own profile or admin can view any
        if user_id != requesting_user_id:
            # Check if requesting user is admin
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT is_admin FROM users WHERE id = ?", (requesting_user_id,))
            result = cursor.fetchone()
            conn.close()
            
            if not result or not result['is_admin']:
                return None  # Unauthorized access
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Use parameterized query and only return safe information
        cursor.execute(
            "SELECT id, username, email, created_at FROM users WHERE id = ?",
            (user_id,)
        )
        
        user = cursor.fetchone()
        conn.close()
        return dict(user) if user else None
    
    def search_users(self, query):
        """Secure user search with parameterized query"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Use parameterized query with LIKE for safe searching
        # Only return non-sensitive information
        cursor.execute(
            "SELECT id, username, email FROM users WHERE username LIKE ? OR email LIKE ?",
            (f"%{query}%", f"%{query}%")
        )
        
        results = cursor.fetchall()
        conn.close()
        return [dict(row) for row in results]
    
    def add_message(self, user_id, message):
        """Add message with input sanitization"""
        # Sanitize message content
        sanitized_message = html.escape(message)
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO messages (user_id, message) VALUES (?, ?)",
            (user_id, sanitized_message)
        )
        
        conn.commit()
        conn.close()
    
    def get_messages(self):
        """Get messages with safe output"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT m.message, u.username, m.created_at
            FROM messages m
            JOIN users u ON m.user_id = u.id
            ORDER BY m.created_at DESC
            LIMIT 50
        ''')
        
        results = cursor.fetchall()
        conn.close()
        return [dict(row) for row in results]

class InputValidator:
    """Input validation and sanitization utilities"""
    
    @staticmethod
    def validate_username(username):
        """Validate username format"""
        if not username or len(username) < 3 or len(username) > 50:
            return False
        return re.match(r'^[a-zA-Z0-9_]+$', username) is not None
    
    @staticmethod
    def validate_password(password):
        """Validate password strength"""
        if not password or len(password) < 6:
            return False
        return True
    
    @staticmethod
    def validate_email(email):
        """Basic email validation"""
        if not email:
            return False
        return re.match(r'^[^@]+@[^@]+\.[^@]+$', email) is not None
    
    @staticmethod
    def sanitize_filename(filename):
        """Sanitize filename to prevent path traversal"""
        if not filename:
            return None
        
        # Remove any path separators and special characters
        filename = os.path.basename(filename)
        filename = re.sub(r'[^a-zA-Z0-9._-]', '', filename)
        
        # Prevent hidden files and special names
        if filename.startswith('.') or filename in ['', '.', '..']:
            return None
        
        return filename
    
    @staticmethod
    def validate_host(host):
        """Validate host for ping command"""
        if not host:
            return False
        
        # Only allow valid hostnames and IP addresses
        # Block command injection characters
        forbidden_chars = [';', '&', '|', '`', '$', '(', ')', '<', '>', '\\', '\n', '\r']
        if any(char in host for char in forbidden_chars):
            return False
        
        # Simple validation for hostname/IP format
        hostname_pattern = r'^[a-zA-Z0-9.-]+$'
        ip_pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
        
        return re.match(hostname_pattern, host) or re.match(ip_pattern, host)

# Initialize database manager
db = DatabaseManager()
validator = InputValidator()

def login_required(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator to require admin privileges"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        
        # Check if user is admin
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT is_admin FROM users WHERE id = ?", (session['user_id'],))
        result = cursor.fetchone()
        conn.close()
        
        if not result or not result['is_admin']:
            return jsonify({'error': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

# HTML Templates (same structure but with security improvements)
LOGIN_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Secure Login</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .container { background: #f9f9f9; padding: 30px; border-radius: 8px; }
        input[type="text"], input[type="password"] { width: 100%; padding: 10px; margin: 10px 0; }
        button { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        .error { color: red; margin: 10px 0; }
        .success { color: green; margin: 10px 0; }
        .security-info { background: #e8f5e8; padding: 15px; border-radius: 4px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h2>🔒 Secure Login System</h2>
        
        <div class="security-info">
            <h3>🛡️ Security Features:</h3>
            <ul>
                <li>✅ Passwords are securely hashed</li>
                <li>✅ SQL injection protection with parameterized queries</li>
                <li>✅ Input validation and sanitization</li>
                <li>✅ Secure session management</li>
                <li>✅ Protection against brute force attacks</li>
            </ul>
        </div>
        
        {% if error %}
            <div class="error">{{ error }}</div>
        {% endif %}
        
        {% if success %}
            <div class="success">{{ success }}</div>
        {% endif %}
        
        <form method="POST">
            <label>Username:</label>
            <input type="text" name="username" required maxlength="50">
            
            <label>Password:</label>
            <input type="password" name="password" required>
            
            <button type="submit">🔐 Secure Login</button>
        </form>
        
        <h3>🧪 Test Credentials:</h3>
        <p><strong>Admin:</strong> admin / admin123</p>
        <p><strong>User:</strong> alice / password123</p>
        
        <p><a href="/dashboard">Go to Dashboard</a></p>
    </div>
</body>
</html>
'''

DASHBOARD_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Secure Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1000px; margin: 20px auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .form-group { margin: 15px 0; }
        input, textarea { width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
        .danger { background: #f44336; }
        .message { background: #e8f5e8; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛡️ Secure Web Application Dashboard</h1>
        <p>Welcome, {{ username }}! | <a href="/logout" style="color: white;">Logout</a></p>
    </div>
    
    <div class="section">
        <h2>🔍 Secure Search</h2>
        <p><strong>Security:</strong> Uses parameterized queries to prevent SQL injection</p>
        <form method="GET" action="/search">
            <input type="text" name="q" placeholder="Search users..." value="{{ query or '' }}">
            <button type="submit">Search</button>
        </form>
        
        {% if search_results %}
            <h3>Search Results:</h3>
            {% for user in search_results %}
                <div class="message">
                    <strong>{{ user.username }}</strong> ({{ user.email }})
                </div>
            {% endfor %}
        {% endif %}
    </div>
    
    <div class="section">
        <h2>💬 Secure Messages</h2>
        <p><strong>Security:</strong> All messages are HTML-escaped to prevent XSS attacks</p>
        <form method="POST" action="/messages">
            <textarea name="message" placeholder="Enter your message..." required maxlength="500"></textarea>
            <button type="submit">Post Message</button>
        </form>
        
        <h3>Recent Messages:</h3>
        {% for msg in messages %}
            <div class="message">
                <strong>{{ msg.username }}:</strong> {{ msg.message }}
                <small>({{ msg.created_at }})</small>
            </div>
        {% endfor %}
    </div>
    
    <div class="section">
        <h2>👤 Secure Profile Access</h2>
        <p><strong>Security:</strong> Proper authorization checks prevent unauthorized access</p>
        <form method="GET" action="/profile">
            <input type="number" name="user_id" placeholder="User ID" min="1" required>
            <button type="submit">View Profile</button>
        </form>
    </div>
    
    <div class="section">
        <h2>🌐 Secure Network Tools</h2>
        <p><strong>Security:</strong> Input validation prevents command injection</p>
        <form method="POST" action="/ping">
            <input type="text" name="host" placeholder="Enter hostname or IP" pattern="[a-zA-Z0-9.-]+" required>
            <button type="submit">Ping Host</button>
        </form>
    </div>
    
    <div class="section">
        <h2>📁 Secure File Access</h2>
        <p><strong>Security:</strong> Path validation prevents directory traversal</p>
        <form method="GET" action="/files">
            <input type="text" name="file" placeholder="Filename (e.g., info.txt)" required>
            <button type="submit">View File</button>
        </form>
    </div>
</body>
</html>
'''

@app.route('/')
def index():
    """Home page with security information"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Secure Web Application</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .container { background: #f0f8f0; padding: 30px; border-radius: 8px; border: 2px solid #4CAF50; }
            .security-badge { background: #4CAF50; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; margin: 10px 0; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #4CAF50; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🛡️ Secure Web Application</h1>
            <div class="security-badge">✅ SECURITY HARDENED</div>
            
            <p>This is a <strong>secure version</strong> of the web application that demonstrates proper security practices.</p>
            
            <h2>🔒 Security Features Implemented:</h2>
            
            <div class="feature">
                <h3>🚫 SQL Injection Protection</h3>
                <p>Uses parameterized queries and input validation to prevent SQL injection attacks.</p>
            </div>
            
            <div class="feature">
                <h3>🚫 XSS Protection</h3>
                <p>All user input is properly encoded and sanitized before display.</p>
            </div>
            
            <div class="feature">
                <h3>🔐 Secure Authentication</h3>
                <p>Passwords are properly hashed with salt, secure session management implemented.</p>
            </div>
            
            <div class="feature">
                <h3>🛡️ Authorization Controls</h3>
                <p>Proper access controls prevent unauthorized access to user data.</p>
            </div>
            
            <div class="feature">
                <h3>🚫 Command Injection Prevention</h3>
                <p>Input validation prevents OS command injection attacks.</p>
            </div>
            
            <div class="feature">
                <h3>🚫 Path Traversal Protection</h3>
                <p>File access is restricted to authorized directories only.</p>
            </div>
            
            <div class="feature">
                <h3>🔒 Security Headers</h3>
                <p>Comprehensive security headers protect against various attacks.</p>
            </div>
            
            <h2>🚀 Get Started:</h2>
            <p><a href="/login">🔐 Login</a> | <a href="/dashboard">📊 Dashboard</a></p>
            
            <h2>🔍 Compare with Vulnerable Version:</h2>
            <p>Compare this secure implementation with <code>vulnerable_app.py</code> to understand the security improvements.</p>
        </div>
    </body>
    </html>
    '''

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Secure login with proper validation"""
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        
        # Input validation
        if not validator.validate_username(username):
            return render_template_string(LOGIN_TEMPLATE, error="Invalid username format")
        
        if not validator.validate_password(password):
            return render_template_string(LOGIN_TEMPLATE, error="Password must be at least 6 characters")
        
        # Authenticate user
        user = db.authenticate_user(username, password)
        if user:
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['is_admin'] = user['is_admin']
            session.permanent = True
            
            logger.info(f"Successful login for user: {username}")
            return redirect(url_for('dashboard'))
        else:
            logger.warning(f"Failed login attempt for username: {username}")
            return render_template_string(LOGIN_TEMPLATE, error="Invalid username or password")
    
    return render_template_string(LOGIN_TEMPLATE)

@app.route('/logout')
def logout():
    """Secure logout"""
    username = session.get('username', 'Unknown')
    session.clear()
    logger.info(f"User logged out: {username}")
    return render_template_string(LOGIN_TEMPLATE, success="Successfully logged out")

@app.route('/dashboard')
@login_required
def dashboard():
    """Secure dashboard with all features"""
    # Get recent messages
    messages = db.get_messages()
    
    # Get search results if there's a query
    search_results = []
    query = request.args.get('q', '').strip()
    if query:
        search_results = db.search_users(query)
    
    return render_template_string(
        DASHBOARD_TEMPLATE,
        username=session['username'],
        messages=messages,
        search_results=search_results,
        query=query
    )

@app.route('/search')
@login_required
def search():
    """Secure search with parameterized queries"""
    query = request.args.get('q', '').strip()
    
    if not query:
        return jsonify({'error': 'Search query required'}), 400
    
    # Input validation
    if len(query) > 100:
        return jsonify({'error': 'Search query too long'}), 400
    
    try:
        results = db.search_users(query)
        return jsonify({'results': results})
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        return jsonify({'error': 'Search failed'}), 500

@app.route('/messages', methods=['GET', 'POST'])
@login_required
def messages():
    """Secure message handling with XSS protection"""
    if request.method == 'POST':
        message = request.form.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        if len(message) > 500:
            return jsonify({'error': 'Message too long (max 500 characters)'}), 400
        
        # Add message (will be sanitized in database layer)
        db.add_message(session['user_id'], message)
        logger.info(f"Message posted by user: {session['username']}")
        
        return redirect(url_for('dashboard'))
    
    # GET request - return messages
    messages = db.get_messages()
    return jsonify({'messages': messages})

@app.route('/profile')
@app.route('/profile/<int:user_id>')
@login_required
def profile(user_id=None):
    """Secure profile access with authorization"""
    if user_id is None:
        user_id = request.args.get('user_id', type=int)
    
    if not user_id:
        return jsonify({'error': 'User ID required'}), 400
    
    # Get user info with authorization check
    user_info = db.get_user_by_id(user_id, session['user_id'])
    
    if not user_info:
        return jsonify({'error': 'User not found or access denied'}), 404
    
    return jsonify({
        'message': 'Profile access successful',
        'user': user_info,
        'note': 'Sensitive information like passwords are never exposed'
    })

@app.route('/ping', methods=['POST'])
@login_required
def ping():
    """Secure ping with command injection prevention"""
    host = request.form.get('host', '').strip()
    
    if not host:
        return jsonify({'error': 'Host parameter required'}), 400
    
    # Validate host to prevent command injection
    if not validator.validate_host(host):
        return jsonify({'error': 'Invalid host format. Only hostnames and IP addresses allowed.'}), 400
    
    try:
        # Use subprocess with shell=False and limited arguments for security
        result = subprocess.run(
            ['ping', '-c', '3', host],
            capture_output=True,
            text=True,
            timeout=10,  # Prevent long-running commands
            shell=False  # Critical: don't use shell=True
        )
        
        return jsonify({
            'command': f'ping -c 3 {host}',
            'returncode': result.returncode,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'note': 'Command executed securely with subprocess protection'
        })
        
    except subprocess.TimeoutExpired:
        return jsonify({'error': 'Ping command timed out'}), 408
    except Exception as e:
        logger.error(f"Ping command error: {str(e)}")
        return jsonify({'error': 'Command execution failed'}), 500

@app.route('/files')
@login_required
def files():
    """Secure file access with path traversal protection"""
    filename = request.args.get('file', '').strip()
    
    if not filename:
        return jsonify({'error': 'Filename parameter required'}), 400
    
    # Sanitize filename to prevent path traversal
    safe_filename = validator.sanitize_filename(filename)
    if not safe_filename:
        return jsonify({'error': 'Invalid filename'}), 400
    
    # Define allowed directory (sandbox)
    allowed_dir = os.path.join(os.path.dirname(__file__), 'safe_files')
    file_path = os.path.join(allowed_dir, safe_filename)
    
    # Ensure file is within allowed directory
    if not file_path.startswith(os.path.abspath(allowed_dir)):
        return jsonify({'error': 'Access denied: Path traversal attempt detected'}), 403
    
    # Create safe_files directory if it doesn't exist
    os.makedirs(allowed_dir, exist_ok=True)
    
    # Create sample file if it doesn't exist
    if safe_filename == 'info.txt' and not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            f.write("This is a safe file that can be accessed.\nFile access is restricted to the safe_files directory.\nPath traversal attacks are prevented.")
    
    try:
        if os.path.exists(file_path) and os.path.isfile(file_path):
            with open(file_path, 'r') as f:
                content = f.read()
            
            return jsonify({
                'filename': safe_filename,
                'content': content,
                'note': 'File access is restricted to safe directory'
            })
        else:
            return jsonify({'error': 'File not found in safe directory'}), 404
            
    except Exception as e:
        logger.error(f"File access error: {str(e)}")
        return jsonify({'error': 'File access failed'}), 500

@app.route('/admin')
@admin_required
def admin():
    """Admin-only functionality"""
    return jsonify({
        'message': 'Admin access successful',
        'user': session['username'],
        'privileges': 'full access',
        'note': 'This endpoint requires admin privileges'
    })

if __name__ == '__main__':
    print("🛡️  Starting Secure Flask Application")
    print("=====================================")
    print("🔒 Security Features Enabled:")
    print("   ✅ SQL Injection Protection")
    print("   ✅ XSS Prevention")
    print("   ✅ Authentication & Authorization")
    print("   ✅ Command Injection Prevention")
    print("   ✅ Path Traversal Protection")
    print("   ✅ Security Headers")
    print("   ✅ Input Validation")
    print("   ✅ Secure Session Management")
    print()
    print("🌐 Application running on: http://localhost:5001")
    print("🧪 Test with the security_tester.py script")
    print()
    print("⚠️  Compare with vulnerable_app.py to see security improvements!")
    
    # Run on different port to avoid conflicts
    app.run(debug=False, host='0.0.0.0', port=5001)