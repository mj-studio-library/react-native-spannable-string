import React, { ComponentType, ReactElement } from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';

type TextComponent = ComponentType<TextProps & any>;

export default class SpannableBuilder {
  static getInstanceWithComponent(
    baseComponent?: TextComponent,
    config?: { additionalStyle?: StyleProp<TextStyle>; outerTextStyle?: StyleProp<TextStyle> },
  ): SpannableBuilder {
    const BaseText = baseComponent || Text;

    const Wrapped = (props): ReactElement => {
      const { style, children, appendedStyle, outerStyle } = props;

      const flattenStyle = StyleSheet.flatten([config?.additionalStyle, style, outerStyle, appendedStyle]);

      return (
        <BaseText style={flattenStyle} {...props}>
          {children}
        </BaseText>
      );
    };

    return new SpannableBuilder(Wrapped, config?.outerTextStyle);
  }

  static getInstance(additionalStyle?: StyleProp<TextStyle>, outerTextStyle?: StyleProp<TextStyle>): SpannableBuilder {
    if (!additionalStyle) return new SpannableBuilder(Text);

    return SpannableBuilder.getInstanceWithComponent(Text, { additionalStyle, outerTextStyle });
  }

  readonly #TextComponent: TextComponent;

  #order = '';
  readonly #textList: string[] = [];
  readonly #customStyleList: StyleProp<TextStyle>[] = [];

  readonly outerTextStyle?: StyleProp<TextStyle>;

  constructor(textComponent: TextComponent, outerTextStyle?: StyleProp<TextStyle>) {
    this.#TextComponent = textComponent;
    this.outerTextStyle = outerTextStyle;
  }

  clear(): void {
    this.#order = '';
    this.#textList.splice(0, this.#textList.length);
    this.#customStyleList.splice(0, this.#customStyleList.length);
  }

  append(text: string): this {
    this.#textList.push(text);
    this.#order += 'T';

    return this;
  }

  appendCustom(text: string, style: StyleProp<TextStyle>): this {
    this.#textList.push(text);
    this.#order += 'S';
    this.#customStyleList.push(style);

    return this;
  }

  appendBold(text: string): this {
    this.appendCustom(text, { fontWeight: 'bold' });

    return this;
  }

  appendBoldWithDelimiter(text: string, delimiter = '$'): this {
    text.split(delimiter).forEach((t, i) => {
      if (i % 2 === 0) {
        this.append(t);
      } else {
        this.appendBold(t);
      }
    });

    return this;
  }

  appendItalic(text: string): this {
    this.appendCustom(text, { fontStyle: 'italic' });

    return this;
  }

  appendColored(text: string, color: string): this {
    this.appendCustom(text, { color });

    return this;
  }

  build(): ReactElement {
    const BaseText: TextComponent = this.#TextComponent;

    let idx = 0;
    let customStyleIdx = 0;

    const result = (
      <BaseText outerStyle={this.outerTextStyle}>
        {[...this.#order].map((order, index) => {
          switch (order) {
            case 'S':
              return (
                <BaseText key={order + index} appendedStyle={this.#customStyleList[customStyleIdx++]}>
                  {this.#textList[idx++]}
                </BaseText>
              );
            default:
              return <BaseText key={order + index}>{this.#textList[idx++]}</BaseText>;
          }
        })}
      </BaseText>
    );

    this.clear();

    return result;
  }
}
