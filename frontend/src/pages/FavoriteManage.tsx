import { Heart, MapPin } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { useElementStore } from '../stores/elementStore';
import { useFavoriteStore } from '../stores/favoriteStore';
import { useLayerStore } from '../stores/layerStore';

export function FavoriteManage() {
  const { elements, selectElement } = useElementStore();
  const { favoriteIds, toggleFavorite } = useFavoriteStore();
  const { layers } = useLayerStore();

  const favoriteElements = useMemo(
    () => elements.filter((element) => favoriteIds.has(element.id)),
    [elements, favoriteIds]
  );

  const grouped = useMemo(
    () =>
      layers
        .map((layer) => ({
          layer,
          elements: favoriteElements.filter((element) => element.layerId === layer.id)
        }))
        .filter((group) => group.elements.length > 0),
    [layers, favoriteElements]
  );

  return (
    <div className="split-page">
      <section className="page-stack min-w-0">
        <header className="page-header">
          <div>
            <h1 className="page-title">收藏构件</h1>
            <p className="page-subtitle">
              已收藏 {favoriteElements.length} 个构件，按楼层分组展示，点击可跳转定位。
            </p>
          </div>
        </header>

        {favoriteElements.length === 0 && (
          <EmptyState
            title="暂无收藏"
            description="在构件浏览器或 3D 视图中点击心形图标收藏构件。"
            action={
              <Link className="primary-button" to="/elements">
                前往构件浏览器
              </Link>
            }
          />
        )}

        <div className="grid gap-4">
          {grouped.map((group) => (
            <section key={group.layer.id} className="panel p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-[color:var(--text-primary)]">
                  {group.layer.name}
                </h2>
                <span className="badge">{group.elements.length} 个</span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {group.elements.map((element) => (
                  <div
                    key={element.id}
                    className="element-list-item"
                  >
                    <span>
                      <span className="block font-semibold">{element.name}</span>
                      <span className="text-xs text-[color:var(--text-muted)]">
                        {element.type} · {element.material}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        className="favorite-button"
                        data-active={favoriteIds.has(element.id)}
                        onClick={() => toggleFavorite(element.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <Heart className="h-4 w-4" />
                      </span>
                      <Link
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--accent)]"
                        to="/viewer"
                        onClick={() => selectElement(element.id)}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        定位
                      </Link>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
