import {useState} from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import {commands} from './commands.js';

export function App() {
  const [selected, setSelected] = useState(0);
  const {exit} = useApp();
  const command = commands[selected];

  useInput((input, key) => {
    if (key.upArrow) {
      setSelected(index => Math.max(0, index - 1));
    } else if (key.downArrow) {
      setSelected(index => Math.min(commands.length - 1, index + 1));
    } else if (input === 'q' || key.escape) {
      exit();
    }
  });

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>pnpm 命令速查</Text>
      <Box flexDirection="column">
        {commands.map((item, index) => (
          <Text key={item.name} color={index === selected ? 'cyan' : undefined}>
            {index === selected ? '❯ ' : '  '}{item.name}
          </Text>
        ))}
      </Box>
      <Box flexDirection="column">
        <Text>{command.description}</Text>
        <Text bold>$ {command.example}</Text>
      </Box>
    </Box>
  );
}
