const fs = require('fs');
const path = require('path');

const SVG_ROOT = path.join(__dirname, '../src/assets/svg');
const SVG_NAME_FILE = path.join(SVG_ROOT, 'svgName.ts');
const INDEX_FILE = path.join(SVG_ROOT, 'index.tsx');

// Function to convert string to PascalCase
const toPascalCase = str => {
  return str
    .replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
    .replace(/[^a-zA-Z0-9]+(.)/g, (g0, g1) => g1.toUpperCase());
};

// Function to convert string to CONSTANT_CASE
const toConstantCase = str => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toUpperCase();
};

const getAllSvgFiles = (dir, fileList = []) => {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllSvgFiles(filePath, fileList);
    } else if (file.endsWith('.svg')) {
      fileList.push(filePath);
    }
  });
  return fileList;
};

const syncSvgs = () => {
  // 1. Ensure assets/svg exists
  if (!fs.existsSync(SVG_ROOT)) {
    fs.mkdirSync(SVG_ROOT, { recursive: true });
    console.log(`Created directory: ${SVG_ROOT}`);
  }

  const svgFiles = getAllSvgFiles(SVG_ROOT);

  // Group by basename to detect duplicates
  const filesByBasename = {};
  svgFiles.forEach(file => {
    const basename = path.basename(file, '.svg');
    if (!filesByBasename[basename]) {
      filesByBasename[basename] = [];
    }
    filesByBasename[basename].push(file);
  });

  const processedItems = [];

  Object.keys(filesByBasename).forEach(basename => {
    const files = filesByBasename[basename];
    files.forEach(filePath => {
      const relativePath = path.relative(SVG_ROOT, filePath);
      // standardized path for import (always forward slashes)
      const importPath = './' + relativePath.split(path.sep).join('/');

      let nameBase;
      if (files.length > 1) {
        // Duplicate: prefix with parent directory name
        const parentDir = path.basename(path.dirname(filePath));
        nameBase = `${parentDir}-${basename}`; // e.g., postCategory-alert
      } else {
        // Unique: use basename
        nameBase = basename;
      }

      processedItems.push({
        filePath: filePath,
        importPath: importPath,
        enumKey: toConstantCase(nameBase),
        componentName: toPascalCase(nameBase),
      });
    });
  });

  // Sort for stable output
  processedItems.sort((a, b) => a.enumKey.localeCompare(b.enumKey));

  // 2. Generate svgName.ts
  const subNameContent = `export enum svgName {
${processedItems
  .map(
    item =>
      `    ${item.enumKey} = '${item.enumKey
        .toLowerCase()
        .replace(/_/g, '-')}',`,
  )
  .join('\n')}
}
`;
  // Note: Enum values are now derived from the key to be unique and consistent.
  // Or we could use the relative path, but simple strings are usually preferred.
  // Let's actually use the key as the string value (but hyphenated/lowercase) to ensure uniqueness easily.

  fs.writeFileSync(SVG_NAME_FILE, subNameContent);
  console.log(`Updated ${SVG_NAME_FILE}`);

  // 3. Generate index.tsx
  const indexContent = `import React from 'react';
import { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { svgName } from './svgName';

${processedItems
  .map(item => `import ${item.componentName} from '${item.importPath}';`)
  .join('\n')}

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
${processedItems
  .map(item => `    [svgName.${item.enumKey}]: ${item.componentName},`)
  .join('\n')}
};

const SvgIcon = (props: SvgIconProps) => {
    const IconToRender = icons[props.name];
    if (!IconToRender) {
        console.warn(\`Icon not found for name: \${props.name}\`);
        return null; 
    }
    return <IconToRender {...props} />;
};

export default SvgIcon;
`;
  fs.writeFileSync(INDEX_FILE, indexContent);
  console.log(`Updated ${INDEX_FILE}`);
};

syncSvgs();
