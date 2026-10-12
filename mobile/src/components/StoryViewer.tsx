import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { resolveAssetUrl } from '../utils/assetUrl';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface Props {
  groups: any[];
  initialGroupIndex: number;
  onClose: () => void;
}

export function StoryViewer({ groups, initialGroupIndex, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [groupIdx, setGroupIdx] = useState(initialGroupIndex);
  const [storyIdx, setStoryIdx] = useState(0);
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  const group = groups[groupIdx];
  const story = group?.stories?.[storyIdx];

  useEffect(() => {
    (async () => {
      if (!story) { setMediaUri(null); return; }
      const uri = await resolveAssetUrl(story.media_url);
      setMediaUri(uri);
    })();
  }, [story?.id]);

  function next() {
    if (!group) return;
    if (storyIdx < group.stories.length - 1) {
      setStoryIdx(storyIdx + 1);
    } else if (groupIdx < groups.length - 1) {
      setGroupIdx(groupIdx + 1);
      setStoryIdx(0);
    } else {
      onClose();
    }
  }

  function prev() {
    if (storyIdx > 0) setStoryIdx(storyIdx - 1);
    else if (groupIdx > 0) {
      const prevGroup = groups[groupIdx - 1];
      setGroupIdx(groupIdx - 1);
      setStoryIdx(prevGroup.stories.length - 1);
    }
  }

  if (!group || !story) {
    onClose();
    return null;
  }

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {/* Header */}
        <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, zIndex: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 14 }}>
              {(group.author_name ?? group.author_alias).charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 14, flex: 1 }}>
            {group.author_alias}
          </Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={{ color: '#FFF', fontSize: 26, lineHeight: 26 }}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bars */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 4 }}>
          {group.stories.map((s: any, i: number) => (
            <View key={s.id} style={{ flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' }}>
              <View style={{ width: i <= storyIdx ? '100%' : '0%', height: '100%', backgroundColor: '#FFF' }} />
            </View>
          ))}
        </View>

        {/* Media */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {mediaUri ? (
            story.media_type === 'video' ? (
              <Text style={{ color: '#FFF' }}>Video (próximamente)</Text>
            ) : (
              <Image source={{ uri: mediaUri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            )
          ) : (
            <ActivityIndicator color="#FFF" />
          )}
        </View>

        {/* Tap zones */}
        <TouchableOpacity
          onPress={prev}
          activeOpacity={1}
          style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: SCREEN_W / 3 }}
        />
        <TouchableOpacity
          onPress={next}
          activeOpacity={1}
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: SCREEN_W * 2 / 3 }}
        />
      </View>
    </Modal>
  );
}
