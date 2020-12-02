import React, { ComponentType, ReactElement } from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

type TextComponent = ComponentType<TextProps & any>;

export default class SpannableBuilder {
  static getInstanceWithComponent(
    baseComponent?: TextComponent,
    config?: { additionalStyle?: TextStyle; outerTextStyle?: TextStyle },
  ): SpannableBuilder {
    const BaseText = baseComponent || Text;

    const Wrapped = (props): ReactElement => {
      const { style, children } = props;

      const flattenStyle = StyleSheet.flatten([config?.additionalStyle, style]);

      return <BaseText style={flattenStyle} {...props}>{children}</BaseText>;
    };

    return new SpannableBuilder(Wrapped, config?.outerTextStyle);
  }

  static getInstance(additionalStyle?: TextStyle, outerTextStyle?: TextStyle): SpannableBuilder {
    if (!additionalStyle) return new SpannableBuilder(Text);

    return SpannableBuilder.getInstanceWithComponent(Text, { additionalStyle, outerTextStyle });
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

  readonly outerTextStyle?: TextStyle;

  constructor(textComponent: TextComponent, outerTextStyle?: TextStyle) {
    this.#TextComponent = textComponent;
    this.outerTextStyle = outerTextStyle;
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
      <BaseText style={this.outerTextStyle}>
        {[...this.#order].map((order, index) => {
          switch (order) {
            case 'B':
              return <BaseText key={order + index} style={{ fontWeight: 'bold' }}>{this.#textList[idx++]}</BaseText>;
            case 'I':
              return <BaseText key={order + index} style={{ fontStyle: 'italic' }}>{this.#textList[idx++]}</BaseText>;
            case 'C':
              return (
                <BaseText
                  key={order + index}
                  style={{ color: this.#colorList[colorIdx++] }}>
                  {this.#textList[idx++]}
                </BaseText>);
            case 'S':
              return (
                <BaseText
                  key={order + index}
                  style={this.#customStyleList[customStyleIdx++]}>
                  {this.#textList[idx++]}
                </BaseText>);
            default:
              return <BaseText key={order + index}>{this.#textList[idx++]}</BaseText>;
          }
        })}
      </BaseText>
    );
  }
}
