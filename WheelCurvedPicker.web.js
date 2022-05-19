/* eslint-disable  @typescript-eslint/member-ordering */
// srouce from https://github.com/react-component/m-picker/blob/master/src/NativePicker.android.tsx

import * as React from 'react';
import { ScrollView, View, StyleSheet, PixelRatio, Text } from 'react-native';
import PropTypes from 'prop-types';

const ratio = PixelRatio.get();

class Picker extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    selectedValue: PropTypes.any,
    onValueChange: PropTypes.func,
    itemStyle: PropTypes.object,
    indicator: PropTypes.bool,
    indicatorColor: PropTypes.string,
    // indicatorStyle: PropTypes.object,
    style: PropTypes.object,
    wheelStyles: PropTypes.object,
    // defaultSelectedValue: PropTypes.any,
    // onScrollChange: PropTypes.func,
    // noAnimate: PropTypes.bool,
  };

  static defaultProps = {
    indicator: true,
  };

  static Item = (_props) => null;

  onItemLayout = (e) => {
    const { height, width } = e.nativeEvent.layout;
    if (this.itemHeight !== height || this.itemWidth !== width) {
      this.itemWidth = width;
      if (this.indicatorRef) {
        this.indicatorRef.setNativeProps({
          style: [
            styles.indicator,
            {
              top: height * 3,
              height,
              width,
            },
          ],
        });
      }
    }
    if (this.itemHeight !== height) {
      this.itemHeight = height;
      if (this.scrollerRef) {
        this.scrollerRef.setNativeProps({
          style: {
            height: height * 7,
          },
        });
      }
      if (this.contentRef) {
        this.contentRef.setNativeProps({
          style: {
            paddingTop: height * 3,
            paddingBottom: height * 3,
          },
        });
      }

      // i do no know why!...
      setTimeout(() => {
        this.select(this.props.selectedValue, this.itemHeight, this.scrollTo);
      }, 0);
    }
  };
  shouldComponentUpdate(nextProps) {
    return this.props.selectedValue !== nextProps.selectedValue || this.props.children !== nextProps.children;
  }
  componentDidUpdate() {
    this.select(this.props.selectedValue, this.itemHeight, this.scrollTo);
  }

  componentWillUnmount() {
    this.clearScrollBuffer();
  }

  clearScrollBuffer() {
    if (this.scrollBuffer) {
      clearTimeout(this.scrollBuffer);
    }
  }

  scrollTo = (y) => {
    if (this.scrollerRef) {
      this.scrollerRef.scrollTo({
        y,
        animated: false,
      });
    }
  };

  fireValueChange = (selectedValue) => {
    if (this.props.selectedValue !== selectedValue && this.props.onValueChange) {
      this.props.onValueChange(selectedValue);
    }
  };

  onScroll = (e) => {
    const { y } = e.nativeEvent.contentOffset;
    this.clearScrollBuffer();
    this.scrollBuffer = setTimeout(() => {
      this.clearScrollBuffer();
      this.doScrollingComplete(y, this.itemHeight, this.fireValueChange);
    }, 100);
  };

  select = (value, itemHeight, scrollTo) => {
    const children = React.Children.toArray(this.props.children);
    for (let i = 0, len = children.length; i < len; i++) {
      if (children[i].props.value === value) {
        this.selectByIndex(i, itemHeight, scrollTo);
        return;
      }
    }
    this.selectByIndex(0, itemHeight, scrollTo);
  };

  selectByIndex(index, itemHeight, zscrollTo) {
    if (index < 0 || index >= React.Children.count(this.props.children) || !itemHeight) {
      return;
    }
    zscrollTo(index * itemHeight);
  }

  computeChildIndex(top, itemHeight, childrenLength) {
    const index = Math.round(top / itemHeight);
    return Math.min(index, childrenLength - 1);
  }

  doScrollingComplete = (top, itemHeight, fireValueChange) => {
    const children = React.Children.toArray(this.props.children);
    const index = this.computeChildIndex(top, itemHeight, children.length);
    const child = children[index];
    if (child) {
      fireValueChange(child.props.value);
    } else if (console.warn) {
      console.warn('child not found', children, index);
    }
  };

  render() {
    const { children, itemStyle, selectedValue, style, indicatorColor, indicator } = this.props;
    const items = React.Children.map(children, (item, index) => {
      const totalStyle = [styles.itemText];
      if (selectedValue === item.props.value) {
        totalStyle.push(styles.selectedItemText);
      }
      totalStyle.push(itemStyle);
      return (
        <View
          ref={(el) => (this[`item${index}`] = el)}
          onLayout={index === 0 ? this.onItemLayout : undefined}
          key={item.key}
        >
          <Text style={totalStyle} numberOfLines={1}>
            {item.props.label}
          </Text>
        </View>
      );
    });
    return (
      <View style={style}>
        {indicator ? (
          <View
            ref={(el) => (this.indicatorRef = el)}
            style={[styles.indicator, indicatorColor ? { borderColor: indicatorColor } : null]}
          />
        ) : null}
        <ScrollView
          style={styles.scrollView}
          ref={(el) => (this.scrollerRef = el)}
          onScroll={this.onScroll}
          scrollEventThrottle={50}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
        >
          <View ref={(el) => (this.contentRef = el)}>{items}</View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    left: 0,
    top: -99,
    borderColor: '#aaa',
    borderTopWidth: 1 / ratio,
    borderBottomWidth: 1 / ratio,
  },

  scrollView: {
    height: 0,
  },

  selectedItemText: {
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 1,
    color: '#000',
  },

  itemText: {
    fontSize: 20,
    opacity: 0.5,
    color: '#000',
    textAlign: 'center',
  },
});

export default Picker;
