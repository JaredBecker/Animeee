export type AnimeSortType = 'trending' | 'top-airing' | 'upcoming' | 'highest-rated' | 'most-popular';

export type AnimeSortTypeURL = {
    [K in AnimeSortType]: string;
};
