export class PerformanceManager {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static requestQueue = new Map<string, Promise<any>>();

  static async memoize<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 300000 // 5 minutes
  ): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    // Prevent duplicate requests
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key);
    }

    const promise = fn().then(data => {
      this.cache.set(key, { data, timestamp: Date.now(), ttl });
      this.requestQueue.delete(key);
      return data;
    }).catch(error => {
      this.requestQueue.delete(key);
      throw error;
    });

    this.requestQueue.set(key, promise);
    return promise;
  }

  static clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  static preloadResource(url: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'fetch';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static measurePerformance(name: string, fn: () => void): void {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  }

  static async loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  static optimizeImages(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
}

export const webWorkerManager = {
  workers: new Map<string, Worker>(),

  createWorker(name: string, script: string): Worker {
    const blob = new Blob([script], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    this.workers.set(name, worker);
    return worker;
  },

  terminateWorker(name: string): void {
    const worker = this.workers.get(name);
    if (worker) {
      worker.terminate();
      this.workers.delete(name);
    }
  },

  terminateAll(): void {
    for (const [name, worker] of this.workers) {
      worker.terminate();
    }
    this.workers.clear();
  }
};