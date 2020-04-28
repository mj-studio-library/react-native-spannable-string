import React, { ComponentType, ReactElement } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

type TextComponent = ComponentType<TextProps & any>;

export default class SpannableBuilder {
  static getInstanceWithComponent(baseComponent?: TextComponent): SpannableBuilder {
    return new SpannableBuilder(baseComponent || Text);
  }

  static getInstance(baseStyle?: TextStyle): SpannableBuilder {
    if (!baseStyle) return new SpannableBuilder(Text);

    const Wrapped = (props): ReactElement => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { style, children } = props;
      return <Text style={baseStyle} {...props}>{children}</Text>;
    };

    return SpannableBuilder.getInstanceWithComponent(Wrapped);
  }

  static append(text: string): SpannableBuilder {
    return new SpannableBuilder(Text).append(text);
  }

  static appendBold(text: string): SpannableBuilder {
    return new SpannableBuilder(Text).appendBold(text);
  }

  static appendItalic(text: string): SpannableBuilder {
    return new SpannableBuilder(Text).appendItalic(text);
  }

  static appendColored(text: string, color: string): SpannableBuilder {
    return new SpannableBuilder(Text).appendColored(text, color);
  }

  static appendCustom(text: string, style: TextStyle): SpannableBuilder {
    return new SpannableBuilder(Text).appendCustom(text, style);
  }

  readonly #TextComponent: TextComponent;

  #order = '';
  readonly #textList: string[] = [];
  readonly #colorList: string[] = [];
  readonly #customStyleList: TextStyle[] = [];

  constructor(textComponent: TextComponent) {
    this.#TextComponent = textComponent;
  }

  append(text: string): this {
    this.#textList.push(text);
    this.#order += 'T';
    return this;
  }

  appendBold(text: string): this {
    this.#textList.push(text);
    this.#order += 'B';
    return this;
  }

  appendItalic(text: string): this {
    this.#textList.push(text);
    this.#order += 'I';
    return this;
  }

  appendColored(text: string, color: string): this {
    this.#textList.push(text);
    this.#order += 'C';
    this.#colorList.push(color);
    return this;
  }

  appendCustom(text: string, style: TextStyle): this {
    this.#textList.push(text);
    this.#order += 'S';
    this.#customStyleList.push(style);
    return this;
  }

  build(): ReactElement {
    const BaseText: TextComponent = this.#TextComponent;

    let idx = 0;
    let colorIdx = 0;
    let customStyleIdx = 0;

    return (
      <BaseText>
        {[...this.#order].map((order, index) => {
          switch (order) {
            case 'B':
              return <BaseText key={order + index} style={{ fontWeight: 'bold' }}>{this.#textList[idx++]}</BaseText>;
            case 'I':
              return <BaseText style={{ fontStyle: 'italic' }}>{this.#textList[idx++]}</BaseText>;
            case 'C':
              return <BaseText style={{ color: this.#colorList[colorIdx++] }}>{this.#textList[idx++]}</BaseText>;
            case 'S':
              return <BaseText style={this.#customStyleList[customStyleIdx++]}>{this.#textList[idx++]}</BaseText>;
            default:
              return <BaseText>{this.#textList[idx++]}</BaseText>;
          }
        })}
      </BaseText>
    );
  }
}
