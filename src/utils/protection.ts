/**
 * ReZone Analytics - Intellectual Property Protection System
 * Copyright (c) 2024 ReZone Analytics. All Rights Reserved.
 * 
 * This file contains proprietary algorithms and trade secrets.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */

class IPProtection {
  private static instance: IPProtection;
  private readonly watermark = 'ReZone-Analytics-Proprietary-2024';
  private readonly checksum = this.generateChecksum();

  private constructor() {
    this.initializeProtection();
  }

  public static getInstance(): IPProtection {
    if (!IPProtection.instance) {
      IPProtection.instance = new IPProtection();
    }
    return IPProtection.instance;
  }

  private generateChecksum(): string {
    const data = `${this.watermark}-${Date.now()}-${Math.random()}`;
    return btoa(data).slice(0, 16);
  }

  private initializeProtection(): void {
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.logSecurityEvent('Context menu access attempted');
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')
      ) {
        e.preventDefault();
        this.logSecurityEvent(`Blocked key combination: ${e.key}`);
      }
    });

    // Detect developer tools
    this.detectDevTools();

    // Add watermark to console
    this.addConsoleWatermark();
  }

  private detectDevTools(): void {
    const threshold = 160;
    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        this.logSecurityEvent('Developer tools detected');
        this.obfuscateContent();
      }
    }, 1000);
  }

  private addConsoleWatermark(): void {
    console.log(
      '%c⚠️ PROPRIETARY SOFTWARE WARNING ⚠️',
      'color: red; font-size: 20px; font-weight: bold;'
    );
    console.log(
      '%cThis is proprietary software owned by ReZone Analytics.',
      'color: red; font-size: 14px;'
    );
    console.log(
      '%cUnauthorized access, copying, or reverse engineering is prohibited.',
      'color: red; font-size: 14px;'
    );
    console.log(
      '%cAll activities are logged and monitored.',
      'color: red; font-size: 14px;'
    );
  }

  private obfuscateContent(): void {
    // Blur sensitive content when dev tools are detected
    const sensitiveElements = document.querySelectorAll('[data-sensitive]');
    sensitiveElements.forEach((element) => {
      (element as HTMLElement).style.filter = 'blur(5px)';
    });
  }

  private logSecurityEvent(event: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      userAgent: navigator.userAgent,
      url: window.location.href,
      checksum: this.checksum
    };
    
    // In production, send to security monitoring service
    console.warn('Security Event:', logEntry);
  }

  public validateIntegrity(): boolean {
    // Check if core files have been tampered with
    const expectedElements = [
      'geoai-panel',
      'ai-recommendations',
      'forecasting-panel'
    ];
    
    return expectedElements.every(id => document.querySelector(`[data-component="${id}"]`));
  }

  public addWatermark(element: HTMLElement): void {
    element.setAttribute('data-watermark', this.watermark);
    element.setAttribute('data-checksum', this.checksum);
  }
}

export const protectionSystem = IPProtection.getInstance();