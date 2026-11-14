
import React from 'react';
export default function ContextMenuView({children, onPress, previewBackgroundColor, dropdownMenuMode, menuConfig, onPressMenuItem, onPressMenuPreview, isMenuPrimaryAction, style, ...props}){
    let s = Array.isArray(style) ? Object.assign({}, ...style) : style;
    return React.createElement('div', {...props, style: s, onClick: onPress}, children);
}

