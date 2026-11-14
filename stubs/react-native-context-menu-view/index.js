
import React from 'react';
import {Pressable} from 'react-native';
export default function ContextMenuView({children, onPress, previewBackgroundColor, dropdownMenuMode, menuConfig, onPressMenuItem, onPressMenuPreview, isMenuPrimaryAction, style, ...props}){
    return React.createElement(Pressable, {style, onPress, ...props}, children);
}

