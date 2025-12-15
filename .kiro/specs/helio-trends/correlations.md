
# Correlation Analysis Methodology

## Research Hypothesis

**Primary Hypothesis**: Solar storm activity influences human behavior patterns, specifically entertainment consumption preferences, leading to measurable correlations between space weather events and Netflix trending content.

**Secondary Hypotheses**:
1. High solar activity (Kp-index > 6) correlates with increased Sci-Fi/Disaster genre popularity
2. Geomagnetic storms affect overall streaming engagement levels
3. Solar flare intensity predicts genre preference shifts within 24-48 hours

## Statistical Methods

### Correlation Coefficients

#### Pearson Correlation
- **Use Case**: Linear relationships between continuous variables
- **Variables**: Kp-index vs Popularity Score, Solar Flare Intensity vs Genre Popularity
- **Interpretation**: -1 (perfect negative) to +1 (perfect positive)
- **Significance**: p-value < 0.05 for statistical significance

#### Spearman Rank Correlation
- **Use Case**: Non-linear monotonic relationships
- **Variables**: Solar event frequency vs trending content changes
- **Advantage**: Robust to outliers and non-normal distributions

#### Kendall's Tau
- **Use Case**: Small sample sizes and tied ranks
- **Variables**: Genre ranking changes vs solar activity levels
- **Benefit**: Better for ordinal data and trend analysis

### Time Series Analysis

#### Cross-Correlation Function (CCF)
```python
def calculate_ccf(solar_data, netflix_data, max_lag=7):
    """
    Calculate cross-correlation with time lags
    max_lag: Maximum days to check for delayed effects
    """
    correlations = []
    for lag in range(-max_lag, max_lag + 1):
        if lag < 0:
            corr = pearsonr(solar_data[:lag], netflix_data[-lag:])
        elif lag > 0:
            corr = pearsonr(solar_data[lag:], netflix_data[:-lag])
        else:
            corr = pearsonr(solar_data, netflix_data)
        correlations.append((lag, corr[0], corr[1]))
    return correlations
```

#### Granger Causality Test
- **Purpose**: Determine if solar activity "Granger-causes" Netflix trends
- **Method**: Vector Autoregression (VAR) model
- **Null Hypothesis**: Solar data does not help predict Netflix trends

### Anomaly Detection

#### Statistical Process Control
- **Control Charts**: Monitor correlation coefficients over time
- **Upper/Lower Control Limits**: ±3 standard deviations
- **Alert Triggers**: Points outside control limits

#### Isolation Forest Algorithm
```python
from sklearn.ensemble import IsolationForest

def detect_anomalies(features):
    """
    Detect anomalous correlation patterns
    features: [kp_index, popularity_score, genre_diversity, time_of_day]
    """
    model = IsolationForest(contamination=0.1, random_state=42)
    anomalies = model.fit_predict(features)
    return anomalies == -1  # True for anomalies
```

## Data Preprocessing

### Normalization Techniques

#### Min-Max Scaling
```python
def normalize_scores(data, min_val=0, max_val=100):
    """Normalize to 0-100 scale for comparison"""
    return (data - data.min()) / (data.max() - data.min()) * (max_val - min_val) + min_val
```

#### Z-Score Standardization
```python
def standardize(data):
    """Convert to standard normal distribution"""
    return (data - data.mean()) / data.std()
```

### Solar Activity Scoring

#### Flare Classification to Numeric Scale
```python
def flare_to_score(flare_class):
    """Convert solar flare class to numeric intensity"""
    class_map = {
        'A': 1, 'B': 2, 'C': 3, 'M': 4, 'X': 5
    }
    base_score = class_map.get(flare_class[0], 0)
    magnitude = float(flare_class[1:]) if len(flare_class) > 1 else 1.0
    return base_score * 10 + magnitude
```

#### Kp-Index Weighting
```python
def kp_impact_score(kp_values):
    """Calculate weighted impact score from Kp-index array"""
    weights = [0.1, 0.2, 0.3, 0.4]  # Recent values weighted more
    return sum(kp * w for kp, w in zip(kp_values[-4:], weights))
```

## Genre Analysis Framework

### Genre Impact Scoring
```python
def calculate_genre_impact(genre_data, solar_score):
    """
    Calculate how solar activity affects each genre
    Returns: Dictionary of genre -> impact_score
    """
    genre_impacts = {}
    for genre in genre_data.keys():
        normal_popularity = genre_data[genre]['baseline']
        current_popularity = genre_data[genre]['current']
        
        # Calculate percentage change
        change = (current_popularity - normal_popularity) / normal_popularity
        
        # Weight by solar activity
        impact = change * solar_score / 100
        genre_impacts[genre] = impact
    
    return genre_impacts
```

### Expected Genre Correlations
- **Science Fiction**: Strong positive correlation (r > 0.6)
- **Disaster/Thriller**: Moderate positive correlation (r > 0.4)
- **Documentary**: Moderate positive correlation (r > 0.3)
- **Romance/Comedy**: Weak or negative correlation (r < 0.2)
- **Horror**: Variable correlation (depends on solar event type)

## Temporal Pattern Analysis

### Lag Effect Investigation
- **Immediate (0-6 hours)**: Direct psychological impact
- **Short-term (6-24 hours)**: Behavioral adjustment period
- **Medium-term (1-3 days)**: Social influence and word-of-mouth
- **Long-term (3-7 days)**: Sustained interest patterns

### Seasonal Adjustments
```python
def seasonal_decompose(data, period=365):
    """
    Separate trend, seasonal, and residual components
    Account for solar cycle (11-year) and annual patterns
    """
    from statsmodels.tsa.seasonal import seasonal_decompose
    decomposition = seasonal_decompose(data, model='additive', period=period)
    return decomposition.trend, decomposition.seasonal, decomposition.resid
```

## Confidence Intervals & Significance Testing

### Bootstrap Confidence Intervals
```python
def bootstrap_correlation(x, y, n_bootstrap=1000, confidence=0.95):
    """
    Calculate bootstrap confidence intervals for correlation
    """
    correlations = []
    n = len(x)
    
    for _ in range(n_bootstrap):
        indices = np.random.choice(n, n, replace=True)
        boot_x, boot_y = x[indices], y[indices]
        correlations.append(pearsonr(boot_x, boot_y)[0])
    
    alpha = 1 - confidence
    lower = np.percentile(correlations, 100 * alpha / 2)
    upper = np.percentile(correlations, 100 * (1 - alpha / 2))
    
    return lower, upper
```

### Multiple Testing Correction
```python
from statsmodels.stats.multitest import multipletests

def correct_p_values(p_values, method='bonferroni'):
    """
    Adjust p-values for multiple comparisons
    """
    rejected, p_corrected, _, _ = multipletests(p_values, method=method)
    return rejected, p_corrected
```

## Insight Generation Rules

### Automated Insight Templates
1. **Strong Correlation Found**: "During periods of high solar activity (Kp > {threshold}), {genre} content shows a {percentage}% increase in popularity (r = {correlation}, p < 0.05)."

2. **Anomaly Detected**: "Unusual pattern detected on {date}: Solar activity was {level} but {genre} popularity was {unexpected_level}, suggesting external factors."

3. **Lag Effect**: "Solar storms appear to influence streaming behavior with a {lag_hours}-hour delay, particularly affecting {most_affected_genre}."

4. **Seasonal Pattern**: "The correlation between solar activity and streaming preferences is strongest during {season}, possibly due to {hypothesized_reason}."

### Confidence Thresholds
- **High Confidence**: r > 0.7, p < 0.001
- **Moderate Confidence**: r > 0.5, p < 0.01
- **Low Confidence**: r > 0.3, p < 0.05
- **Inconclusive**: r < 0.3 or p > 0.05

## Validation & Robustness Checks

### Cross-Validation
- **Time Series Split**: Train on first 70% of data, test on remaining 30%
- **Rolling Window**: Validate correlations using sliding time windows
- **Out-of-Sample Testing**: Reserve recent data for final validation

### Sensitivity Analysis
- **Parameter Variation**: Test different lag periods, normalization methods
- **Outlier Removal**: Check correlation stability after removing extreme values
- **Alternative Metrics**: Compare results using different correlation measures

### Null Hypothesis Testing
- **Randomization Test**: Shuffle time series to test for spurious correlations
- **Monte Carlo Simulation**: Generate random data with similar properties
- **Control Variables**: Account for day-of-week, seasonal, and holiday effects
