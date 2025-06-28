/**
 * ReZone Analytics - Protected Component Wrapper
 * Copyright (c) 2024 ReZone Analytics. All Rights Reserved.
 */

import React, { useEffect, useRef } from 'react';
import { protectionSystem } from '../utils/protection';

interface ProtectedComponentProps {
  children: React.ReactNode;
  componentId: string;
  sensitiveData?: boolean;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  componentId,
  sensitiveData = false
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      protectionSystem.addWatermark(elementRef.current);
      
      if (sensitiveData) {
        elementRef.current.setAttribute('data-sensitive', 'true');
      }
    }
  }, [sensitiveData]);

  return (
    <div
      ref={elementRef}
      data-component={componentId}
      className="protected-component"
    >
      {children}
    </div>
  );
};