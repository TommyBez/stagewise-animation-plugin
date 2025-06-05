'use client';

import { ToolbarPlugin, UserMessage } from '@stagewise/toolbar';
import { Panel, Button, Badge, useState, useEffect } from '@stagewise/toolbar/plugin-ui';


interface AnimationConfig {
  type: 'css-transition' | 'css-keyframes' | 'motion' | 'react-spring' | 'gsap' | 'lottie';
  duration: number;
  easing: string;
  delay: number;
  iterations: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  properties: string[];
  customOptions: Record<string, any>;
}

// Module-scoped variable to hold the latest config
let currentAnimationConfig: AnimationConfig | null = null;

const ANIMATION_TYPES = [
  { value: 'css-transition', label: 'CSS Transitions', description: 'Simple property transitions' },
  { value: 'css-keyframes', label: 'CSS Keyframes', description: 'Complex keyframe animations' },
  { value: 'motion/react', label: 'Motion React', description: 'React animation library' },
  { value: 'react-spring', label: 'React Spring', description: 'Spring-physics animations' },
  { value: 'gsap', label: 'GSAP', description: 'Professional animation library' },
  { value: 'lottie', label: 'Lottie', description: 'After Effects animations' },
] as const;

const EASING_OPTIONS = [
  'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear',
  'cubic-bezier(0.25, 0.1, 0.25, 1)', 'cubic-bezier(0.42, 0, 0.58, 1)',
  'cubic-bezier(0.42, 0, 1, 1)', 'cubic-bezier(0, 0, 0.58, 1)'
];

const COMMON_PROPERTIES = [
  'opacity', 'transform', 'background-color', 'color', 'width', 'height',
  'margin', 'padding', 'border', 'box-shadow', 'border-radius'
];

// Professional styling constants
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    padding: '24px',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600' as const,
    color: '#000000',
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const,
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #e5e5e5',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#000000',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #e5e5e5',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#000000',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  row: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
  },
  column: {
    flex: 1,
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#333333',
    cursor: 'pointer',
    padding: '8px 0',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#000000',
  },
  customPropertyRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  customPropertyInput: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '13px',
    border: '1px solid #e5e5e5',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#000000',
    outline: 'none',
    fontFamily: 'inherit',
  },
  button: {
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: '500' as const,
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap' as const,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
  selectedPropertiesSection: {
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #e5e5e5',
  },
  selectedPropertiesLabel: {
    fontSize: '12px',
    fontWeight: '600' as const,
    color: '#666666',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
  },
  badgeContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  footerContainer: {
    padding: '20px 24px',
    borderTop: '1px solid #e5e5e5',
    backgroundColor: '#fafafa',
  },
  footerText: {
    fontSize: '12px',
    color: '#666666',
    fontStyle: 'italic' as const,
  },
};

const AnimationPanel = () => {
  const [config, setConfig] = useState<AnimationConfig>({
    type: 'css-transition',
    duration: 300,
    easing: 'ease',
    delay: 0,
    iterations: 1,
    direction: 'normal',
    fillMode: 'both',
    properties: ['opacity', 'transform'],
    customOptions: {}
  });

  // Update module-scoped variable when config changes
  useEffect(() => {
    currentAnimationConfig = config;
  }, [config]);

  const [selectedProperties, setSelectedProperties] = useState<string[]>(['opacity', 'transform']);
  const [customProperty, setCustomProperty] = useState('');

  const updateConfig = (updates: Partial<AnimationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleProperty = (property: string) => {
    const newProperties = selectedProperties.includes(property)
      ? selectedProperties.filter(p => p !== property)
      : [...selectedProperties, property];
    setSelectedProperties(newProperties);
    updateConfig({ properties: newProperties });
  };

  const addCustomProperty = () => {
    if (customProperty && !selectedProperties.includes(customProperty)) {
      const newProperties = [...selectedProperties, customProperty];
      setSelectedProperties(newProperties);
      updateConfig({ properties: newProperties });
      setCustomProperty('');
    }
  };

  const selectedType = ANIMATION_TYPES.find(t => t.value === config.type);

  return (
    <Panel>
      <Panel.Header 
        title="Animation Builder" 
        description={selectedType?.description}
      />
      
      <Panel.Content>
        <div style={styles.container}>
          {/* Animation Type Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Animation Type</label>
            <select
              value={config.type}
              onChange={(e) => updateConfig({ type: (e.target as HTMLSelectElement).value as AnimationConfig['type'] })}
              style={{
                ...styles.select,
                ':focus': { borderColor: '#000000' }
              }}
              onFocus={(e) => (e.target.style.borderColor = '#000000')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e5e5')}
            >
              {ANIMATION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} — {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* Duration and Delay */}
          <div style={styles.row}>
            <div style={styles.column}>
              <label style={styles.label}>Duration (ms)</label>
              <input
                type="number"
                value={config.duration}
                onChange={(e) => updateConfig({ duration: parseInt((e.target as HTMLInputElement).value) || 300 })}
                style={styles.input}
                min="0"
                step="100"
                onFocus={(e) => (e.target.style.borderColor = '#000000')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e5e5')}
              />
            </div>

            <div style={styles.column}>
              <label style={styles.label}>Delay (ms)</label>
              <input
                type="number"
                value={config.delay}
                onChange={(e) => updateConfig({ delay: parseInt((e.target as HTMLInputElement).value) || 0 })}
                style={styles.input}
                min="0"
                step="100"
                onFocus={(e) => (e.target.style.borderColor = '#000000')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e5e5')}
              />
            </div>
          </div>

          {/* Easing */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Easing Function</label>
            <select
              value={config.easing}
              onChange={(e) => updateConfig({ easing: (e.target as HTMLSelectElement).value })}
              style={styles.select}
              onFocus={(e) => (e.target.style.borderColor = '#000000')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e5e5')}
            >
              {EASING_OPTIONS.map(easing => (
                <option key={easing} value={easing}>{easing}</option>
              ))}
            </select>
          </div>

          {/* Iterations and Direction */}
          <div style={styles.row}>
            <div style={styles.column}>
              <label style={styles.label}>Iterations</label>
              <select
                value={config.iterations}
                onChange={(e) => updateConfig({ 
                  iterations: (e.target as HTMLSelectElement).value === 'infinite' ? 'infinite' : parseInt((e.target as HTMLSelectElement).value) 
                })}
                style={styles.select}
                onFocus={(e) => (e.target.style.borderColor = '#000000')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e5e5')}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value="infinite">Infinite</option>
              </select>
            </div>

            <div style={styles.column}>
              <label style={styles.label}>Direction</label>
              <select
                value={config.direction}
                onChange={(e) => updateConfig({ direction: (e.target as HTMLSelectElement).value as AnimationConfig['direction'] })}
                style={styles.select}
                onFocus={(e) => (e.target.style.borderColor = '#000000')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e5e5')}
              >
                <option value="normal">Normal</option>
                <option value="reverse">Reverse</option>
                <option value="alternate">Alternate</option>
                <option value="alternate-reverse">Alternate Reverse</option>
              </select>
            </div>
          </div>

          {/* Fill Mode */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Fill Mode</label>
            <select
              value={config.fillMode}
              onChange={(e) => updateConfig({ fillMode: (e.target as HTMLSelectElement).value as AnimationConfig['fillMode'] })}
              style={styles.select}
              onFocus={(e) => (e.target.style.borderColor = '#000000')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e5e5')}
            >
              <option value="none">None</option>
              <option value="forwards">Forwards</option>
              <option value="backwards">Backwards</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Properties to Animate */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Properties to Animate</label>
            <div style={styles.checkboxGrid}>
              {COMMON_PROPERTIES.map(property => (
                <label key={property} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property)}
                    onChange={() => toggleProperty(property)}
                    style={styles.checkbox}
                  />
                  <span>{property}</span>
                </label>
              ))}
            </div>
            
            <div style={styles.customPropertyRow}>
              <input
                type="text"
                placeholder="Add custom property..."
                value={customProperty}
                onChange={(e) => setCustomProperty((e.target as HTMLInputElement).value)}
                style={styles.customPropertyInput}
                onFocus={(e) => (e.target.style.borderColor = '#000000')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e5e5')}
              />
              <Button 
                onClick={addCustomProperty} 
                disabled={!customProperty}
              >
                Add Property
              </Button>
            </div>
          </div>

          {/* Selected Properties Display */}
          {selectedProperties.length > 0 && (
            <div style={styles.selectedPropertiesSection}>
              <div style={styles.selectedPropertiesLabel}>
                Selected Properties ({selectedProperties.length})
              </div>
              <div style={styles.badgeContainer}>
                {selectedProperties.map(property => (
                  // @ts-ignore - Badge broke the build
                  <Badge key={property} style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}>{property}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Panel.Content>

      <Panel.Footer>
        <div style={styles.footerContainer}>
          <div style={styles.footerText}>
            {selectedType?.description}
          </div>
        </div>
      </Panel.Footer>
    </Panel>
  );
};

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
    return <AnimationPanel />;
  },

  onPromptSend: (prompt: UserMessage) => {
    // Check if there's an active configuration from the AnimationPanel
    if (currentAnimationConfig && prompt.contextElements && prompt.contextElements.length > 0) {
      const selectedTypeInfo = ANIMATION_TYPES.find(t => t.value === currentAnimationConfig!.type);
      
      let contextSuffix = "\n\n--- Animation Builder Plugin Context ---\n";
      contextSuffix += `Please implement a ${selectedTypeInfo?.label} animation on the selected element(s) with these specifications:\n`;
      contextSuffix += `- Animation Type: ${selectedTypeInfo?.label}\n`;
      contextSuffix += `- Duration: ${currentAnimationConfig.duration}ms\n`;
      contextSuffix += `- Easing: ${currentAnimationConfig.easing}\n`;
      contextSuffix += `- Delay: ${currentAnimationConfig.delay}ms\n`;
      contextSuffix += `- Iterations: ${currentAnimationConfig.iterations}\n`;
      contextSuffix += `- Direction: ${currentAnimationConfig.direction}\n`;
      contextSuffix += `- Fill Mode: ${currentAnimationConfig.fillMode}\n`;
      contextSuffix += `- Properties: ${currentAnimationConfig.properties.join(', ')}\n`;
      contextSuffix += `\nApply this animation to the selected element considering its current styles and structure.\n`;
      contextSuffix += "--- End Animation Builder Plugin Context ---\n";

      return {
        contextSnippets: [
          {
            promptContextName: 'Animation Implementation Request',
            content: contextSuffix
          }
        ]
      };
    }
    // No active configuration or selected elements
    return null;
  }
};