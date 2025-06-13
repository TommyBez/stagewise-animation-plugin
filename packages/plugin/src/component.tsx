'use client';

import { ToolbarPlugin, UserMessage } from '@stagewise/toolbar';
import { Panel, Button, Badge, useState, useEffect, useMemo, useCallback } from '@stagewise/toolbar/plugin-ui';

// Import our production-ready utilities
import { 
  AnimationConfig, 
  ANIMATION_TYPES, 
  EASING_OPTIONS, 
  COMMON_PROPERTIES, 
  DEFAULT_CONFIG,
  VALIDATION_LIMITS
} from './types';
import { 
  validateAnimationConfig, 
  validateCustomProperty, 
  sanitizeNumericInput, 
  sanitizeStringInput 
} from './utils/validation';
import { Logger, PluginError, ErrorType, DebouncedErrorHandler } from './utils/error-handling';
import { useDebounce, PerformanceMonitor } from './utils/performance';

// Module-scoped variable to hold the latest config (with validation)
let currentAnimationConfig: AnimationConfig | null = null;

// Initialize logger
const logger = Logger.getInstance();

/**
 * Main animation panel component with production-ready features
 */
const AnimationPanel = () => {
  const [config, setConfig] = useState<AnimationConfig>(DEFAULT_CONFIG);
  const [selectedProperties, setSelectedProperties] = useState<string[]>(DEFAULT_CONFIG.properties);
  const [customProperty, setCustomProperty] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce config updates to improve performance
  const debouncedConfig = useDebounce(config, 300);

  // Update module-scoped variable when debounced config changes
  useEffect(() => {
    const endMeasure = PerformanceMonitor.startMeasure('config-validation');
    
    try {
      const validation = validateAnimationConfig(debouncedConfig);
      
      if (validation.isValid) {
        currentAnimationConfig = debouncedConfig;
        setValidationErrors([]);
        logger.debug('Animation config updated successfully', debouncedConfig);
      } else {
        setValidationErrors(validation.errors);
        logger.warn('Animation config validation failed', validation.errors);
      }
    } catch (error) {
      const pluginError = new PluginError(
        'Failed to validate animation configuration',
        ErrorType.VALIDATION_ERROR,
        { config: debouncedConfig }
      );
      
      DebouncedErrorHandler.logError('config-validation', pluginError.message, pluginError);
      setValidationErrors(['Configuration validation failed. Please check your inputs.']);
    } finally {
      endMeasure();
    }
  }, [debouncedConfig]);

  // Memoized computation for selected animation type
  const selectedType = useMemo(() => {
    return ANIMATION_TYPES.find(t => t.value === config.type);
  }, [config.type]);

  // Safe config update with error handling and sanitization
  const updateConfig = useCallback((updates: Partial<AnimationConfig>) => {
    try {
      setConfig(prev => {
        const newConfig = { ...prev, ...updates };
        
        // Sanitize numeric values
        if (typeof updates.duration === 'number') {
          newConfig.duration = Math.max(VALIDATION_LIMITS.MIN_DURATION, 
            Math.min(VALIDATION_LIMITS.MAX_DURATION, updates.duration));
        }
        
        if (typeof updates.delay === 'number') {
          newConfig.delay = Math.max(VALIDATION_LIMITS.MIN_DELAY, 
            Math.min(VALIDATION_LIMITS.MAX_DELAY, updates.delay));
        }
        
        return newConfig;
      });
    } catch (error) {
      DebouncedErrorHandler.logError('config-update', 'Failed to update configuration', error);
    }
  }, []);

  // Handle property toggle with validation
  const toggleProperty = useCallback((property: string) => {
    try {
      const newProperties = selectedProperties.includes(property)
        ? selectedProperties.filter(p => p !== property)
        : [...selectedProperties, property];
      
      setSelectedProperties(newProperties);
      updateConfig({ properties: newProperties });
      
      logger.debug('Property toggled', { property, newProperties });
    } catch (error) {
      DebouncedErrorHandler.logError('property-toggle', 'Failed to toggle property', error);
    }
  }, [selectedProperties, updateConfig]);

  // Handle adding custom property with validation
  const addCustomProperty = useCallback(async () => {
    const endMeasure = PerformanceMonitor.startMeasure('add-custom-property');
    setIsLoading(true);
    
    try {
      const sanitizedProperty = sanitizeStringInput(customProperty, VALIDATION_LIMITS.MAX_CUSTOM_PROPERTY_LENGTH);
      
      if (!sanitizedProperty) {
        logger.warn('Attempted to add empty custom property');
        return;
      }
      
      const validation = validateCustomProperty(sanitizedProperty);
      
      if (!validation.isValid) {
        setValidationErrors(prev => [...prev, ...validation.errors]);
        logger.warn('Custom property validation failed', validation.errors);
        return;
      }
      
      if (selectedProperties.includes(sanitizedProperty)) {
        logger.info('Custom property already exists', { property: sanitizedProperty });
        return;
      }
      
      const newProperties = [...selectedProperties, sanitizedProperty];
      setSelectedProperties(newProperties);
      updateConfig({ properties: newProperties });
      setCustomProperty('');
      
      logger.info('Custom property added successfully', { property: sanitizedProperty });
    } catch (error) {
      const pluginError = new PluginError(
        'Failed to add custom property',
        ErrorType.RUNTIME_ERROR,
        { customProperty }
      );
      
      DebouncedErrorHandler.logError('add-custom-property', pluginError.message, pluginError);
    } finally {
      setIsLoading(false);
      endMeasure();
    }
  }, [customProperty, selectedProperties, updateConfig]);

  // Handle numeric input changes with sanitization
  const handleNumericInput = useCallback((
    field: 'duration' | 'delay',
    value: string
  ) => {
    const sanitized = sanitizeNumericInput(value, DEFAULT_CONFIG[field]);
    updateConfig({ [field]: sanitized });
  }, [updateConfig]);

  // Handle iterations input with special handling for 'infinite'
  const handleIterationsChange = useCallback((value: string) => {
    try {
      const sanitized = value === 'infinite' ? 'infinite' : parseInt(value, 10) || 1;
      updateConfig({ iterations: sanitized });
    } catch (error) {
      DebouncedErrorHandler.logError('iterations-change', 'Failed to update iterations', error);
    }
  }, [updateConfig]);

  // Error display component
  const ErrorDisplay = useMemo(() => {
    if (validationErrors.length === 0) return null;
    
    return (
      <div style={{ 
        padding: '12px', 
        backgroundColor: '#fee', 
        border: '1px solid #fcc', 
        borderRadius: '4px',
        marginBottom: '16px'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#c33', fontSize: '14px' }}>
          Configuration Issues:
        </h4>
        <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '12px', color: '#666' }}>
          {validationErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }, [validationErrors]);

  return (
    <Panel>
      <Panel.Header 
        title="Animation Builder" 
        description={selectedType?.description || 'Configure your animation'}
      />
      
      <Panel.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
          {ErrorDisplay}
          
          {/* Animation Type Selection */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Animation Type
            </label>
            <select
              value={config.type}
              onChange={(e) => {
                const target = e.target as HTMLSelectElement;
                updateConfig({ type: target.value as AnimationConfig['type'] });
              }}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              aria-label="Select animation type"
            >
              {ANIMATION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* Duration and Delay */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Duration (ms)
              </label>
              <input
                type="number"
                value={config.duration}
                onChange={(e) => handleNumericInput('duration', (e.target as HTMLInputElement).value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                min={VALIDATION_LIMITS.MIN_DURATION}
                max={VALIDATION_LIMITS.MAX_DURATION}
                step="100"
                aria-label="Animation duration in milliseconds"
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Delay (ms)
              </label>
              <input
                type="number"
                value={config.delay}
                onChange={(e) => handleNumericInput('delay', (e.target as HTMLInputElement).value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                min={VALIDATION_LIMITS.MIN_DELAY}
                max={VALIDATION_LIMITS.MAX_DELAY}
                step="100"
                aria-label="Animation delay in milliseconds"
              />
            </div>
          </div>

          {/* Easing */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Easing Function
            </label>
            <select
              value={config.easing}
              onChange={(e) => updateConfig({ easing: (e.target as HTMLSelectElement).value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              aria-label="Select easing function"
            >
              {EASING_OPTIONS.map(easing => (
                <option key={easing} value={easing}>{easing}</option>
              ))}
            </select>
          </div>

          {/* Iterations and Direction */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Iterations
              </label>
              <select
                value={config.iterations}
                onChange={(e) => handleIterationsChange((e.target as HTMLSelectElement).value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                aria-label="Select number of iterations"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value="infinite">Infinite</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Direction
              </label>
              <select
                value={config.direction}
                onChange={(e) => updateConfig({ direction: (e.target as HTMLSelectElement).value as AnimationConfig['direction'] })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                aria-label="Select animation direction"
              >
                <option value="normal">Normal</option>
                <option value="reverse">Reverse</option>
                <option value="alternate">Alternate</option>
                <option value="alternate-reverse">Alternate Reverse</option>
              </select>
            </div>
          </div>

          {/* Fill Mode */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Fill Mode
            </label>
            <select
              value={config.fillMode}
              onChange={(e) => updateConfig({ fillMode: (e.target as HTMLSelectElement).value as AnimationConfig['fillMode'] })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              aria-label="Select fill mode"
            >
              <option value="none">None</option>
              <option value="forwards">Forwards</option>
              <option value="backwards">Backwards</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Properties to Animate */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Properties to Animate
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              {COMMON_PROPERTIES.map(property => (
                <label key={property} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property)}
                    onChange={() => toggleProperty(property)}
                    aria-label={`Toggle ${property} animation`}
                  />
                  <span style={{ fontSize: '12px' }}>{property}</span>
                </label>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Custom property..."
                value={customProperty}
                onChange={(e) => setCustomProperty((e.target as HTMLInputElement).value)}
                style={{ 
                  flex: 1, 
                  padding: '6px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc', 
                  fontSize: '12px' 
                }}
                maxLength={VALIDATION_LIMITS.MAX_CUSTOM_PROPERTY_LENGTH}
                aria-label="Enter custom CSS property name"
              />
              <Button 
                onClick={addCustomProperty} 
                disabled={!customProperty.trim() || isLoading}
                aria-label="Add custom property"
              >
                {isLoading ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </div>

          {/* Selected Properties Display */}
          {selectedProperties.length > 0 && (
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>
                Selected Properties ({selectedProperties.length}):
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {selectedProperties.map((property, index) => (
                  <span 
                    key={`property-${index}`}
                    style={{
                      padding: '2px 8px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ddd',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#666'
                    }}
                  >
                    {property}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Panel.Content>

      <Panel.Footer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>
            {selectedType?.description}
          </span>
          <span style={{ fontSize: '10px', color: '#999' }}>
            v0.3.0
          </span>
        </div>
      </Panel.Footer>
    </Panel>
  );
};

/**
 * Production-ready plugin configuration with comprehensive error handling
 */
export const animationPlugin: ToolbarPlugin = {
  pluginName: 'animation-builder',
  displayName: 'Animation Builder',
  description: 'Build animations with a visual interface and send specifications to Cursor',
  iconSvg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 12L15 15M12 12L9 9M12 12L15 9M12 12L9 15" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),
  
  onActionClick: () => {
    const endMeasure = PerformanceMonitor.startMeasure('panel-render');
    
    try {
      logger.info('Animation panel opened');
      const panel = <AnimationPanel />;
      endMeasure();
      return panel;
    } catch (error) {
      endMeasure();
      const pluginError = new PluginError(
        'Failed to render animation panel',
        ErrorType.RUNTIME_ERROR
      );
      
      logger.error(pluginError.message, pluginError);
      
      // Return fallback UI
      return (
        <div style={{ 
          padding: '16px', 
          border: '1px solid #ff6b6b', 
          borderRadius: '4px', 
          backgroundColor: '#ffe0e0',
          color: '#2d3436'
        }}>
          <h3 style={{ color: '#d63031', margin: '0 0 8px 0' }}>Plugin Error</h3>
          <p style={{ margin: '0', fontSize: '14px' }}>
            Failed to load the animation panel. Please try refreshing the page.
          </p>
        </div>
      );
    }
  },

  onPromptSend: (prompt: UserMessage) => {
    const endMeasure = PerformanceMonitor.startMeasure('prompt-processing');
    
    try {
      // Check if there's an active configuration from the AnimationPanel
      if (currentAnimationConfig && prompt.contextElements && prompt.contextElements.length > 0) {
        const validation = validateAnimationConfig(currentAnimationConfig);
        
        if (!validation.isValid) {
          logger.warn('Attempted to send invalid animation configuration', validation.errors);
          return null;
        }
        
        const selectedTypeInfo = ANIMATION_TYPES.find(t => t.value === currentAnimationConfig.type);
        
        let contextSuffix = "\n\n--- Animation Builder Plugin Context ---\n";
        contextSuffix += `Please implement a ${selectedTypeInfo?.label || 'CSS'} animation on the selected element(s) with these specifications:\n`;
        contextSuffix += `- Animation Type: ${selectedTypeInfo?.label || currentAnimationConfig.type}\n`;
        contextSuffix += `- Duration: ${currentAnimationConfig.duration}ms\n`;
        contextSuffix += `- Easing: ${currentAnimationConfig.easing}\n`;
        contextSuffix += `- Delay: ${currentAnimationConfig.delay}ms\n`;
        contextSuffix += `- Iterations: ${currentAnimationConfig.iterations}\n`;
        contextSuffix += `- Direction: ${currentAnimationConfig.direction}\n`;
        contextSuffix += `- Fill Mode: ${currentAnimationConfig.fillMode}\n`;
        contextSuffix += `- Properties: ${currentAnimationConfig.properties.join(', ')}\n`;
        
        if (Object.keys(currentAnimationConfig.customOptions).length > 0) {
          contextSuffix += `- Custom Options: ${JSON.stringify(currentAnimationConfig.customOptions, null, 2)}\n`;
        }
        
        contextSuffix += `\nApply this animation to the selected element considering its current styles and structure.\n`;
        contextSuffix += "Follow modern CSS animation best practices and ensure accessibility.\n";
        contextSuffix += "--- End Animation Builder Plugin Context ---\n";

        logger.info('Animation context sent to prompt', { 
          type: currentAnimationConfig.type, 
          properties: currentAnimationConfig.properties.length 
        });

        endMeasure();
        
        return {
          contextSnippets: [
            {
              promptContextName: 'Animation Implementation Request',
              content: contextSuffix
            }
          ]
        };
      }
      
      endMeasure();
      return null;
    } catch (error) {
      endMeasure();
      
      const pluginError = new PluginError(
        'Failed to process animation prompt',
        ErrorType.RUNTIME_ERROR,
        { hasConfig: !!currentAnimationConfig }
      );
      
      DebouncedErrorHandler.logError('prompt-processing', pluginError.message, pluginError);
      return null;
    }
  }
};