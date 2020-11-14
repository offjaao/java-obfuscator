import { CodeAttributeInfo, ConstantPoolInfo, LocalVariableTableAttributeInfo, MethodInfo, Utf8Info } from "java-class-tools";
import Method from "../interfaces/Method";
import { uint8ToString } from "../utils/stringutils";
import { methodFieldTransform } from './methodFieldTransform';

type Transformers = 'methodFieldTransform';

export const methodTransform = {
  transform: (constantPool: ConstantPoolInfo[], method: MethodInfo, transformers: Transformers[]): Method => {
    const name = uint8ToString((constantPool[method.name_index] as Utf8Info).bytes);

    const code = (method.attributes.find(attr => 
      uint8ToString((constantPool[attr.attribute_name_index] as Utf8Info).bytes) === 'Code'
    ) as CodeAttributeInfo);
    
    let fields = [];
    if(transformers.indexOf('methodFieldTransform') !== -1) {
      if(code) {
        fields = methodFieldTransform.transform(constantPool, code);
      }
    }

    return { name, fields };
  }
}