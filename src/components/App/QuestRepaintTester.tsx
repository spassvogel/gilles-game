import { useQuest } from "hooks/store/quests";

// Test if components that use `useQuest` repaint too much.
// hint: they do
const QuestRepaintTester = () => {

    const quest = useQuest("kill10Boars");
    // const quest = useQuestLog("kill10Boars");
    console.log('repaint ' + quest.name)
    return null;
}

export default QuestRepaintTester;