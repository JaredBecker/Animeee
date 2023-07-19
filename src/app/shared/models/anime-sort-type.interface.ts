export type AnimeSortType = 'trending-this-week' | 'top-airing-anime' | 'upcoming-anime' | 'highest-rated-anime' | 'most-popular-anime';

export type AnimeSortTypeURL = {
    [K in AnimeSortType]: string;
};
