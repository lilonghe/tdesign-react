import React, { useState } from 'react';
import { Input } from '@tencent/tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input
        prefixIcon="search"
        suffixIcon="prompt_fill"
        placeholder="请输入内容"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
}