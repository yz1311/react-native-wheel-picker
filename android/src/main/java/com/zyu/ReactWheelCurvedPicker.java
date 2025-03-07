package com.zyu;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Shader;
import android.os.SystemClock;
import android.util.AttributeSet;

import com.aigestudio.wheelpicker.WheelPicker;
import com.aigestudio.wheelpicker.WheelPicker;
import com.aigestudio.wheelpicker.WheelPicker.OnWheelChangeListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.common.UIManagerType;

import java.util.List;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
public class ReactWheelCurvedPicker extends WheelPicker {
//    private Integer indicatorColor = Color.WHITE;
    private final EventDispatcher mEventDispatcher;
    private List<String> mValueData;

    private int mState;
//    public void setIndicatorColor(Integer indicatorColor) {
//            this.indicatorColor = indicatorColor;
//         }
    public ReactWheelCurvedPicker(ReactContext reactContext) {
        super(reactContext);
        // 通过判断是否能获取到 UIManagerModule 来确定架构类型
        UIManagerModule uiManagerModule = reactContext.getNativeModule(UIManagerModule.class);
        if (uiManagerModule == null) {
             // 如果无法获取 UIManagerModule，说明是新架构
            mEventDispatcher = UIManagerHelper.getUIManager(reactContext, UIManagerType.FABRIC).getEventDispatcher();
        } else {
            // 能获取到 UIManagerModule，说明是旧架构
            mEventDispatcher = uiManagerModule.getEventDispatcher();
        }
        setOnWheelChangeListener(new OnWheelChangeListener() {
            @Override
            public void onWheelScrolled(int offset) {
            }

            @Override
            public void onWheelSelected(int position) {
                if (mValueData != null && position < mValueData.size()) {
                    mEventDispatcher.dispatchEvent(
                            new ItemSelectedEvent(getId(), mValueData.get(position)));
                }
            }

            @Override
            public void onWheelScrollStateChanged(int state) {
                mState = state;
            }
        });
    }

//    @Override
//    protected void drawForeground(Canvas canvas) {
//        super.drawForeground(canvas);
//
//        Paint paint = new Paint();
//        paint.setColor(this.indicatorColor);
//        canvas.drawLine(rectCurItem.left, rectCurItem.top, rectCurItem.right, rectCurItem.top, paint);
//        canvas.drawLine(rectCurItem.left, rectCurItem.bottom, rectCurItem.right, rectCurItem.bottom, paint);
//    }
    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

//    @Override
//    public void setItemIndex(int index) {
//        super.setItemIndex(index);
//        unitDeltaTotal = 0;
//        mHandler.post(this);
//    }

    public void setValueData(List<String> data) {
        mValueData = data;
    }

    public int getState() {
        return mState;
    }

}

class ItemSelectedEvent extends Event<ItemSelectedEvent> {

    public static final String EVENT_NAME = "wheelCurvedPickerPageSelected";

    private final String mValue;

    protected ItemSelectedEvent(int viewTag,  String value) {
        super(viewTag);
        mValue = value;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();
        eventData.putString("data", mValue);
        return eventData;
    }
}
