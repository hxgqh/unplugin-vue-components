import type {
  ComponentResolver,
  SideEffectsInfo,
} from '../../types'
import { kebabCase } from '../utils'

export interface FormilyElementResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp
}

function getSideEffects(
  partialName: string,
  options: FormilyElementResolverOptions,
): SideEffectsInfo | undefined {
  const { importStyle = 'css' } = options

  if (!importStyle)
    return

  if (importStyle === 'sass') {
    return [
      'element-ui/packages/theme-chalk/src/base.scss',
      `element-ui/packages/theme-chalk/src/${partialName}.scss`,
    ]
  }
  else {
    return [
      'element-ui/lib/theme-chalk/base.css',
      `element-ui/lib/theme-chalk/${partialName}.css`,
    ]
  }
}

/**
 * Resolver for Element-UI
 * @link https://element.eleme.cn/#/zh-CN
 * @version @element-ui ^2.15.3, @vue ^2.6.14
 * @author @nabaonan
 */
export function FormilyElementResolver(options: FormilyElementResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (options.exclude && name.match(options.exclude))
        return
      if (/^El[A-Z]/.test(name)) {
        const compName = name.slice(2)
        const partialName = kebabCase(compName)
        if (partialName === 'collapse-transition') {
          return {
            from: `element-ui/lib/transitions/${partialName}`,
          }
        }
        return {
          from: `@formily/element/lib/${partialName}`,
          sideEffects: getSideEffects(partialName, options),
        }
      }
    },
  }
}
