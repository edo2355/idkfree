import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { Input } from '../components/Input';
import { Avatar } from '../components/Avatar';
import { SearchIcon } from '../components/icons/SearchIcon';
import { HeaderBar } from '../components/HeaderBar';

export function SearchScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (query.length < 2) return;
    setLoading(true);
    try {
      const res = await api.search.users(query);
      setUsers(res.results);
    } catch {}
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <HeaderBar title="Buscar" />

      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', marginBottom: 16, alignItems: 'center' }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Input value={query} onChangeText={setQuery} placeholder="Buscar personas..." />
          </View>
          <TouchableOpacity
            onPress={handleSearch}
            disabled={loading}
            activeOpacity={0.7}
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              backgroundColor: theme.text,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchIcon size={22} color={theme.bg} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          !loading && query.length >= 2 ? (
            <Text style={{ color: theme.textMuted, textAlign: 'center', paddingVertical: 40, fontFamily: fonts.regular }}>
              Sin resultados
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 8, marginBottom: 8 }}
          >
            <Avatar name={item.name ?? item.alias} url={item.avatar_url} />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontWeight: '600', color: theme.text, fontFamily: fonts.medium }}>{item.name ?? item.alias}</Text>
              <Text style={{ fontSize: 13, color: theme.textMuted, fontFamily: fonts.regular }}>@{item.alias}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
