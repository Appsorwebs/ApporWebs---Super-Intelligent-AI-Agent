import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const ENCRYPTION_KEY = 'apporwebs-secure-key-2024';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export class SecurityManager {
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  static validateApiKey(key: string): boolean {
    return key.length >= 20 && /^[a-zA-Z0-9\-_]+$/.test(key);
  }

  static setSecureSession(data: any): void {
    const encrypted = this.encrypt(JSON.stringify(data));
    Cookies.set('apporwebs_session', encrypted, {
      expires: new Date(Date.now() + SESSION_TIMEOUT),
      secure: true,
      sameSite: 'strict'
    });
  }

  static getSecureSession(): any {
    const encrypted = Cookies.get('apporwebs_session');
    if (!encrypted) return null;
    
    try {
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  static clearSession(): void {
    Cookies.remove('apporwebs_session');
  }

  static generateSecureId(): string {
    return CryptoJS.lib.WordArray.random(16).toString();
  }

  static hashData(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  static isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  static rateLimit = (() => {
    const requests = new Map<string, number[]>();
    
    return (key: string, limit: number = 10, window: number = 60000): boolean => {
      const now = Date.now();
      const userRequests = requests.get(key) || [];
      
      // Remove old requests outside the window
      const validRequests = userRequests.filter(time => now - time < window);
      
      if (validRequests.length >= limit) {
        return false;
      }
      
      validRequests.push(now);
      requests.set(key, validRequests);
      return true;
    };
  })();
}

export const webContainerSecurity = {
  sanitizeCode: (code: string): string => {
    // Remove potentially dangerous patterns
    return code
      .replace(/eval\s*\(/g, '// eval(')
      .replace(/Function\s*\(/g, '// Function(')
      .replace(/document\.write/g, '// document.write')
      .replace(/innerHTML\s*=/g, '// innerHTML =')
      .replace(/outerHTML\s*=/g, '// outerHTML =');
  },

  validateFileOperation: (path: string): boolean => {
    // Prevent directory traversal
    const normalizedPath = path.replace(/\\/g, '/');
    return !normalizedPath.includes('../') && 
           !normalizedPath.includes('./') && 
           !normalizedPath.startsWith('/');
  },

  createSandboxedIframe: (content: string): string => {
    return `
      <iframe 
        srcdoc="${content.replace(/"/g, '&quot;')}"
        sandbox="allow-scripts allow-same-origin allow-forms"
        style="width: 100%; height: 100%; border: none;"
        loading="lazy"
      ></iframe>
    `;
  }
};