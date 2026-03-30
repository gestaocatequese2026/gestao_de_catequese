const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib/templates.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Define SUGGESTED_ROTEIRO if not present
if (!content.includes('const SUGGESTED_ROTEIRO')) {
    const roteiroConst = `
const SUGGESTED_ROTEIRO: RoteiroStep[] = [
  { id: '1', label: 'Acolhida', tempo: '10 min', responsavel: 'Catequista', descricao: 'Acolhida com música e saudação inicial.' },
  { id: '2', label: 'Oração Inicial', tempo: '05 min', responsavel: 'Catequizando', descricao: 'Oração espontânea ou leitura de uma prece.' },
  { id: '3', label: 'Proclamação', tempo: '15 min', responsavel: 'Catequista', descricao: 'Leitura pausada do texto bíblico do dia.' },
  { id: '4', label: 'Reflexão e Atividade', tempo: '20 min', responsavel: 'Todos', descricao: 'Conversa sobre o tema e atividade prática proposta.' },
  { id: '5', label: 'Oração Final', tempo: '10 min', responsavel: 'Catequista', descricao: 'Agradecimento e oração do Pai Nosso.' },
];
`;
    content = content.replace('export const initialTemplates: Template[] = [', roteiroConst + '\nexport const initialTemplates: Template[] = [');
}

// Ensure RoteiroStep interface is present
if (!content.includes('export interface RoteiroStep')) {
    const interfaceDef = `export interface RoteiroStep {
  id: string;
  label: string;
  tempo: string;
  responsavel: string;
  descricao: string;
  tipo?: string;
}

`;
    content = interfaceDef + content;
}

// Add roteiro: RoteiroStep[] to Template interface if not present
if (content.includes('textoExplicativo: string;') && !content.includes('roteiro: RoteiroStep[];')) {
    content = content.replace('textoExplicativo: string;', 'textoExplicativo: string;\n  roteiro: RoteiroStep[];');
}

// Add roteiro property to each template object in initialTemplates array
// Look for closing braces of objects that don't have roteiro
const templateRegex = /\{(?:[^{}]|\{[^{}]*\})*?\}/g;
const templatesMatch = content.match(/initialTemplates: Template\[\] = \[([\s\S]*?)\];/);

if (templatesMatch) {
    let templatesArrayStr = templatesMatch[1];
    
    // Split into individual objects
    // This is tricky because of nested template literals.
    // Let's use a more robust way: find each id: '...' and process the block.
    
    const individualTemplateRegex = /\{\s*id:\s*'([a-z0-9]+)',[\s\S]*?\n\s*\}/g;
    
    templatesArrayStr = templatesArrayStr.replace(individualTemplateRegex, (match) => {
        if (!match.includes('roteiro:')) {
            return match.replace(/\n\s*\}$/, ',\n    roteiro: SUGGESTED_ROTEIRO\n  }');
        }
        return match;
    });
    
    content = content.replace(templatesMatch[1], templatesArrayStr);
}

fs.writeFileSync(filePath, content);
console.log('Templates updated successfully!');
