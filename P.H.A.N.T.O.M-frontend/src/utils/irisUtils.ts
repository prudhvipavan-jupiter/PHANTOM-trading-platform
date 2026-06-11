export const processVoiceCommand = (command: string): string => {
  const lowerCommand = command.toLowerCase();

  // This is a placeholder for actual command processing logic.
  // In a real application, this would involve NLP, intent recognition, etc.

  if (lowerCommand.includes("hello iris")) {
    return "Hello! How can I assist you today?";
  } else if (lowerCommand.includes("what's my current portfolio p&l")) {
    return "Please refer to the Portfolio Dashboard for your current P&L. I can guide you there if you'd like.";
  } else if (lowerCommand.includes("how many trades today")) {
    return "I don't have real-time trade data yet, but I can summarize your trade history for you.";
  } else if (lowerCommand.includes("switch to paper trading")) {
    return "I can't switch modes directly via voice yet, but you can change it in the trading preferences settings.";
  } else if (lowerCommand.includes("activate autonomous mode")) {
    return "Autonomous mode activation is not available via voice command for security reasons.";
  } else if (lowerCommand.includes("place a buy order")) {
    return "I'm not authorized to place real trades. Please use the trading interface for placing orders.";
  } else if (lowerCommand.includes("read market overview")) {
    return "The market overview feature is not yet integrated with my voice capabilities.";
  } else if (lowerCommand.includes("logout")) {
    return "Logging out requires manual confirmation for security. Please use the logout button in the header.";
  } else if (lowerCommand.includes("speak strategy")) {
    return "The 'Speak Strategy' function will be implemented on the AI Strategy Builder page.";
  }

  return "I'm sorry, I didn't understand that command. Could you please rephrase?";
}; 