import type { ComponentType, ReactElement } from 'react';
import React from 'react';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

type TextComponent = ComponentType<TextProps>;
type Config = {
  additionalStyle?: StyleProp<TextStyle>;
  outerTextStyle?: StyleProp<TextStyle>;
};
type InnerConfig = {
  appendedStyle?: StyleProp<TextStyle>;
  outerStyle?: StyleProp<TextStyle>;
};
export default class SpannableBuilder {
  static getInstanceWithComponent(
    baseComponent?: TextComponent,
    config?: Config
  ): SpannableBuilder {
    const BaseText: TextComponent = baseComponent || Text;

    const Wrapped: TextComponent = (
      props: TextProps & InnerConfig
    ): ReactElement => {
      const { style, children, appendedStyle, outerStyle } = props;

      const flattenStyle = StyleSheet.flatten([
        config?.additionalStyle,
        style,
        outerStyle,
        appendedStyle,
      ]);

      return (
        <BaseText style={flattenStyle} {...props}>
          {children}
        </BaseText>
      );
    };

    return new SpannableBuilder(Wrapped, config?.outerTextStyle);
  }

  static getInstance(
    additionalStyle?: StyleProp<TextStyle>,
    outerTextStyle?: StyleProp<TextStyle>
  ): SpannableBuilder {
    if (!additionalStyle) return new SpannableBuilder(Text);

    return SpannableBuilder.getInstanceWithComponent(Text, {
      additionalStyle,
      outerTextStyle,
    });
  }

  readonly #TextComponent: ComponentType<TextProps & InnerConfig>;

  #order = '';
  readonly #textList: (string | ReactElement)[] = [];
  readonly #customStyleList: StyleProp<TextStyle>[] = [];

  readonly outerTextStyle?: StyleProp<TextStyle>;

  constructor(
    textComponent: TextComponent,
    outerTextStyle?: StyleProp<TextStyle>
  ) {
    this.#TextComponent = textComponent;
    this.outerTextStyle = outerTextStyle;
  }

  clear(): void {
    this.#order = '';
    this.#textList.splice(0, this.#textList.length);
    this.#customStyleList.splice(0, this.#customStyleList.length);
  }

  append(text: string): this {
    if (typeof text !== 'string') return this;

    this.#textList.push(text);
    this.#order += 'T';

    return this;
  }

  appendCustom(text: string, style: StyleProp<TextStyle>): this {
    if (typeof text !== 'string') return this;

    this.#textList.push(text);
    this.#order += 'S';
    this.#customStyleList.push(style);

    return this;
  }

  appendBold(text: string): this {
    if (typeof text !== 'string') return this;

    this.appendCustom(text, { fontWeight: 'bold' });

    return this;
  }

  appendItalic(text: string): this {
    if (typeof text !== 'string') return this;

    this.appendCustom(text, { fontStyle: 'italic' });

    return this;
  }

  appendColored(text: string, color: string): this {
    if (typeof text !== 'string') return this;

    this.appendCustom(text, { color });

    return this;
  }

  appendCustomComponent(component: ReactElement): this {
    this.#textList.push(component);
    this.#order += 'C';

    return this;
  }

  private appendWithDelimiter({
    appender,
    delimiter,
    text,
  }: {
    text: string;
    delimiter: string;
    appender: (text: string) => void;
  }): this {
    if (typeof text !== 'string') return this;

    text.split(delimiter).forEach((t, i) => {
      if (i % 2 === 0) {
        this.append(t);
      } else {
        appender(t);
      }
    });

    return this;
  }

  appendCustomWithDelimiter(
    text: string,
    style: StyleProp<TextStyle>,
    delimiter = '$'
  ): this {
    return this.appendWithDelimiter({
      text,
      delimiter,
      appender: (text) => {
        this.appendCustom(text, style);
      },
    });
  }

  appendBoldWithDelimiter(text: string, delimiter = '$'): this {
    return this.appendWithDelimiter({
      text,
      delimiter,
      appender: (text) => {
        this.appendBold(text);
      },
    });
  }

  appendItalicWithDelimiter(text: string, delimiter = '$'): this {
    return this.appendWithDelimiter({
      text,
      delimiter,
      appender: (text) => {
        this.appendItalic(text);
      },
    });
  }

  appendColoredWithDelimiter(
    text: string,
    color: string,
    delimiter = '$'
  ): this {
    return this.appendWithDelimiter({
      text,
      delimiter,
      appender: (text) => {
        this.appendColored(text, color);
      },
    });
  }

  build(): ReactElement {
    const BaseText = this.#TextComponent;

    let idx = 0;
    let customStyleIdx = 0;

    const result = (
      <BaseText outerStyle={this.outerTextStyle}>
        {[...this.#order].map((order, index) => {
          const key = `${order}${index}`;

          switch (order) {
            case 'S':
              return (
                <BaseText
                  key={key}
                  appendedStyle={this.#customStyleList[customStyleIdx++]}
                >
                  {this.#textList[idx++]}
                </BaseText>
              );
            case 'C':
              return <View key={key}>{this.#textList[idx++]}</View>;
            default:
              return <BaseText key={key}>{this.#textList[idx++]}</BaseText>;
          }
        })}
      </BaseText>
    );

    this.clear();

    return result;
  }
}
