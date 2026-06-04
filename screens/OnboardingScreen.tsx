import { View, Text } from "react-native";
interface Props { onComplete: () => void; }
export default function OnboardingScreen({ onComplete }: Props) {
  return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><Text>Onboarding coming soon</Text></View>;
}
