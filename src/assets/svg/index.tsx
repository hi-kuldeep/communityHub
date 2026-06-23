import React from 'react';
import { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { svgName } from './svgName';



interface SvgIconProps {
    name: svgName;
    color?: ColorValue;
    width?: number;
    height?: number;
    fill?: ColorValue;
    stroke?: ColorValue;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

const icons: Record<svgName, React.ComponentType<any>> = {

};

const SvgIcon = (props: SvgIconProps) => {
    const IconToRender = icons[props.name];
    if (!IconToRender) {
        console.warn(`Icon not found for name: ${props.name}`);
        return null; 
    }
    return <IconToRender {...props} />;
};

export default SvgIcon;
