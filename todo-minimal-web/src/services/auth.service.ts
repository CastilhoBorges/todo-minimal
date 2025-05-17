
import { User } from "@/types";

// This is a mock implementation. In a real app, this would connect to your backend.
class AuthService {
  private storageKey = 'todo_app_user';
  private users: User[] = [];

  constructor() {
    // Load users from localStorage
    const storedUsers = localStorage.getItem('todo_app_users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }

  async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user with matching email
    const user = this.users.find(u => u.email === email);
    
    // In a real app, you would verify the password hash here
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Save user to localStorage (simulating a session)
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    
    return user;
  }

  async register(name: string, email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    if (this.users.some(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name
    };
    
    // In a real app, you would hash the password here
    
    // Save user to "database" (localStorage)
    this.users.push(newUser);
    localStorage.setItem('todo_app_users', JSON.stringify(this.users));
    
    // Save user to localStorage (simulating a session)
    localStorage.setItem(this.storageKey, JSON.stringify(newUser));
    
    return newUser;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.storageKey);
    return userData ? JSON.parse(userData) : null;
  }
}

export default new AuthService();
