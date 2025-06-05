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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
          {/* Animation Type Selection */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Animation Type
            </label>
            <select
              value={config.type}
              onChange={(e) => updateConfig({ type: (e.target as HTMLSelectElement).value as AnimationConfig['type'] })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {ANIMATION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Duration (ms)
              </label>
              <input
                type="number"
                value={config.duration}
                onChange={(e) => updateConfig({ duration: parseInt((e.target as HTMLInputElement).value) || 300 })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                min="0"
                step="100"
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Delay (ms)
              </label>
              <input
                type="number"
                value={config.delay}
                onChange={(e) => updateConfig({ delay: parseInt((e.target as HTMLInputElement).value) || 0 })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                min="0"
                step="100"
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
                onChange={(e) => updateConfig({ 
                  iterations: (e.target as HTMLSelectElement).value === 'infinite' ? 'infinite' : parseInt((e.target as HTMLSelectElement).value) 
                })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
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
                <label key={property} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property)}
                    onChange={() => toggleProperty(property)}
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
                style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
              />
              <Button onClick={addCustomProperty} disabled={!customProperty}>
                Add
              </Button>
            </div>
          </div>

          {/* Selected Properties Display */}
          {selectedProperties.length > 0 && (
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}>
                Selected Properties:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {selectedProperties.map(property => (
                  // @ts-ignore - Badge broke the build
                  <Badge key={property}>{property}</Badge>
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