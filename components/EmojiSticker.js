import { View, Image } from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';

//The createAnimatedComponent() can wrap any component. It looks at the style prop of the component,
//determines which value is animated, and then applies updates to create an animation.
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function EmojiSticker({ imageSize, stickerSource }) {
  //It helps to mutate a piece of data and allows running animations based on the current value.
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  //Animates the transition while scaling the sticker image.
  const onDoubleTap = useAnimatedGestureHandler({
    // Gesture event 'active'
    onActive: () => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      }else{
        scaleImage.value = scaleImage.value / 2;
      }
    },
  });
  const onDrag = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
  });

  //The useAnimatedStyle() hook from react-native-reanimated is used to create a style object that will be applied to the sticker image.
  //It will update styles using the shared values when the animation happens.
  const imageStyle = useAnimatedStyle(() => {
    // I did remove withSpring() animation cause its not working
    return {
      width: scaleImage.value,
      height: scaleImage.value,
    };
  });
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onDrag}>
      <AnimatedView style={[containerStyle, { top: -350 }]}>
        <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
          <AnimatedImage
            source={stickerSource}
            resizeMode='contain'
            style={[imageStyle,{ width: imageSize, height: imageSize }]}
          />
        </TapGestureHandler>
      </AnimatedView>
    </PanGestureHandler>
  );
}
