export const COLORS = {
    primary: '#6366f1', // Indigo 500
    secondary: '#ec4899', // Pink 500
    accent: '#8b5cf6', // Violet 500
    background: '#0f172a', // Slate 900
    surface: '#1e293b', // Slate 800
    surfaceHighlight: '#334155', // Slate 700
    text: '#f8fafc', // Slate 50
    textDim: '#94a3b8', // Slate 400
    success: '#22c55e', // Green 500
    error: '#ef4444', // Red 500
    warning: '#f59e0b', // Amber 500
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const FONTS = {
    regular: 'Inter-Regular', // Need to load these or use system fonts
    bold: 'Inter-Bold',
};

// Glassmorphism style helper
export const GLASS_STYLE = {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    backdropFilter: 'blur(10px)', // Web only property
    // For Native: need BlurView
};
