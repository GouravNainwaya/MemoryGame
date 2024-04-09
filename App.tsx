import {StyleSheet, Text, View,  SafeAreaView as SafeAreaIOS, Platform, Alert, TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
const characters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const App = () => {
  const [cards, setCards] = useState<string[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);

  useEffect(() => {
    restartGame();
  }, []);

  const restartGame = (): void => {
    const shuffledCards = characters.sort(() => Math.random() - 0.5);
    setCards([...shuffledCards, ...shuffledCards]);
    setFlippedIndices([]);
    setAttempts(0);
    setMatches(0);
  };

  const handleCardPress = (value: string, index: number): void => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index)) {
      return;
    }

    setFlippedIndices([...flippedIndices, index]);

    if (flippedIndices.length === 1) {
      const [firstIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      if (firstCard === value) {
        setMatches(matches + 1);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
      setAttempts(attempts + 1);
    }

    if (matches === characters.length - 1) {
      Alert.alert('Congratulations!', 'You have completed the game!', [{ text: 'Restart', onPress: restartGame }]);
    }
  };

  const SafeArea = Platform.OS === 'ios' ? SafeAreaIOS : SafeAreaView;
  return (
    <SafeArea style={{flex: 1}}>
    <View style={styles.container}>
      <Text style={styles.headerText}>Memory Game</Text>
      <Text style={styles.infoText}>Attempts: {attempts} | Matches: {matches}</Text>
      <View style={styles.board}>
        {[0, 1, 2, 3].map((rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {[0, 1, 2, 3].map((colIndex) => {
              const index = rowIndex * 4 + colIndex;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.card,
                    { backgroundColor: flippedIndices.includes(index) ? 'green' : 'blue' },
                  ]}
                  onPress={() => handleCardPress(cards[index], index)}
                  disabled={flippedIndices.includes(index) || matches === characters.length - 1}
                >
                  {flippedIndices.includes(index) && <Text style={styles.cardText}>{cards[index]}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
    </SafeArea>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black'
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black'
  },
  board: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    width: 70,
    height: 70,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 24,
    color: 'white',
  },
});