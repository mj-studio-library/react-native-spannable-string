# react-native-spannable-string
![npm](https://img.shields.io/npm/v/react-native-spannable-string)

### The simple Text builder for multiple styling in single Text component

How do you make this?

<img src="https://github.com/mym0404/react-native-spannable-string/blob/master/sample1.jpg" width="300px">

### Verbose way 😓

```tsx
<Text style={{ fontSize: 24 }}>
  Using <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Bold</Text>{' '}
  in Text
</Text>
```

### SpannableBuilder way 🔥

```tsx
SpannableBuilder.getInstance({ fontSize: 24 })
  .append('Using ')
  .appendBold('Bold')
  .append(' in Text')
  .build()
```


## Contents 🏆 

* [Install](#install-)
* [Usage](#usage-)
* [Change Logs](#change-logs-)
## Install 💠 

```
npm i @mj-studio/react-native-spannable-string
```

or

```
yarn add @mj-studio/react-native-spannable-string
```

## Usage 📌 

0. Import class from package

```tsx
import SpannableBuilder from '@mj-studio/react-native-spannable-string';
```

1. Create `SpannableBuilder` instance

Instantiate `SpannableBuiler` instance with static `getInstance` function.
`getInstance` receive *`TextStyle` parameter for base style used by `SpannableBuilder`*

```tsx
SpannableBuilder.getInstance({ fontSize: 24 })
```

We can also instantate it with `Text` component with `getInstanceWithComponent` like this.

```tsx
SpannableBuilder.getInstanceWithComponent(Text)

// or custom Text component
type Props = { fontFamily: string } & TextProps;
function MyText({fontFamily = 'NotoSansKR-Bold', ...rest}: React.PropsWithChildren<Props>) {
  const { style, children, ...withOutStyle } = rest;

  return (
    <Text style={[style, { fontFamily: fontFamily }]} {...withOutStyle}>
      {children}
    </Text>
  );
}

SpannableBuilder.getInstanceWithComponent(MyText)
```

2. Append your texts with spannable free 

```tsx
<View style={{ marginVertical: 64 }}>
  {SpannableBuilder.getInstance({ fontSize: 24 })
    .append('Using ')
    .appendBold('Bold')
    .append(' in Text')
    .build()}
  {SpannableBuilder.getInstance({ fontSize: 24 })
    .append('Using ')
    .appendItalic('Italic')
    .append(' in Text')
    .build()}
  {SpannableBuilder.getInstance({ fontSize: 24 })
    .append('Using ')
    .appendColored('Color', 'red')
    .append(' in Text')
    .build()}
  {SpannableBuilder.getInstance({ fontSize: 24 })
    .append('Using ')
    .appendCustom('Custom Style', {
      textShadowColor: 'blue',
      textShadowRadius: 8,
    })
    .append(' in Text')
    .build()}
</View>

// Sample Title
 SpannableBuilder.getInstance({ fontSize: 44 })
   .appendColored('S', 'red')
   .appendItalic('p')
   .appendCustom('a', {
     fontSize: 30,
     textShadowColor: 'blue',
     textShadowRadius: 12,
   })
   .appendColored('n', 'orange')
   .appendCustom('n', {
     fontSize: 22,
     textDecorationLine: 'underline',
   })
   .appendColored('a', 'skyblue')
   .appendCustom('b', {
     backgroundColor: 'black',
     color: 'white',
     fontSize: 22,
   })
   .appendCustom('l', { fontSize: 18, color: 'red' })
   .appendBold('e ')
   .build(),

```


## Change Logs 🔧  
* 1.0.0
  - First Release 🔥

### feel free your fork or any PR! Thanks
