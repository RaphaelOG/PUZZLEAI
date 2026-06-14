import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const GRID_SIZE = 2;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

function isNeighbor(index, emptyIndex) {
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
  const emptyCol = emptyIndex % GRID_SIZE;

  const rowDiff = Math.abs(row - emptyRow);
  const colDiff = Math.abs(col - emptyCol);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function createShuffledTiles() {
  const solved = Array.from({ length: TILE_COUNT }, (_, i) => i);
  let tiles = [...solved];
  let emptyIndex = tiles.indexOf(0);

  for (let i = 0; i < 30; i += 1) {
    const neighbors = [];

    const row = Math.floor(emptyIndex / GRID_SIZE);
    const col = emptyIndex % GRID_SIZE;

    if (row > 0) neighbors.push(emptyIndex - GRID_SIZE);
    if (row < GRID_SIZE - 1) neighbors.push(emptyIndex + GRID_SIZE);
    if (col > 0) neighbors.push(emptyIndex - 1);
    if (col < GRID_SIZE - 1) neighbors.push(emptyIndex + 1);

    const nextIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
    const temp = tiles[nextIndex];
    tiles[nextIndex] = tiles[emptyIndex];
    tiles[emptyIndex] = temp;
    emptyIndex = nextIndex;
  }

  if (isSolved(tiles)) {
    return createShuffledTiles();
  }

  return tiles;
}

function isSolved(tiles) {
  return tiles.every((value, index) => value === index);
}

export default function SlidingPuzzle({ onSolved }) {
  const [tiles, setTiles] = useState(() => createShuffledTiles());

  useEffect(() => {
    if (isSolved(tiles)) {
      onSolved?.();
    }
  }, [tiles, onSolved]);

  const emptyIndex = useMemo(() => tiles.indexOf(0), [tiles]);

  const handlePressTile = (index) => {
    if (!isNeighbor(index, emptyIndex)) return;

    setTiles((current) => {
      const next = [...current];
      const temp = next[index];
      next[index] = next[emptyIndex];
      next[emptyIndex] = temp;
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {tiles.map((value, index) => {
          if (value === 0) {
            return <View key={index} style={[styles.tile, styles.emptyTile]} />;
          }

          return (
            <TouchableOpacity
              key={index}
              style={styles.tile}
              onPress={() => handlePressTile(index)}
              activeOpacity={0.8}
            >
              <Text style={styles.tileText}>{value}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.helperText}>Slide tiles to order 1–3 with the empty space last.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  grid: {
    width: 180,
    height: 180,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#020617',
    borderRadius: 24,
    padding: 8,
    gap: 8,
  },
  tile: {
    width: (180 - 8 * 2 - 8) / 2,
    height: (180 - 8 * 2 - 8) / 2,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTile: {
    backgroundColor: 'transparent',
  },
  tileText: {
    color: '#020617',
    fontSize: 20,
    fontWeight: '700',
  },
  helperText: {
    marginTop: 12,
    color: '#e5e5e5',
    fontSize: 12,
    textAlign: 'center',
  },
});

