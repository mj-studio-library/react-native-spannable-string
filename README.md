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
npm i react-native-spannable-string
```

or

```
yarn add react-native-spannable-string
```

## Usage 📌 

## Change Logs 🔧  
* 1.0.0
  - First Release 🔥

### feel free your fork or any PR! Thanks
