/* 
    This file is part of MiraMon Map Browser.
    MiraMon Map Browser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MiraMon Map Browser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
    See the GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General 
    Public License along with MiraMon Map Browser.
    If not, see https://www.gnu.org/licenses/licenses.html#AGPL.
    
    MiraMon Map Browser can be updated from
    https://github.com/grumets/MiraMonMapBrowser.

    Copyright 2001, 2021 Xavier Pons

    Aquest codi JavaScript ha estat idea de Joan Masó Pau (joan maso at uab cat) 
    amb l'ajut de Núria Julià (n julia at creaf uab cat)
    dins del grup del MiraMon. MiraMon és un projecte del 
    CREAF que elabora programari de Sistema d'Informació Geogràfica 
    i de Teledetecció per a la visualització, consulta, edició i anàlisi 
    de mapes ràsters i vectorials. Aquest programari inclou
    aplicacions d'escriptori i també servidors i clients per Internet.
    No tots aquests productes són gratuïts o de codi obert. 
    
    En particular, el Navegador de Mapes del MiraMon (client per Internet) 
    es distribueix sota els termes de la llicència GNU Affero General Public 
    License, mireu https://www.gnu.org/licenses/licenses.html#AGPL.
    
    El Navegador de Mapes del MiraMon es pot actualitzar des de 
    https://github.com/grumets/MiraMonMapBrowser.
*/

"use strict"

/* From: DCAL_Vegeration_phenology_Apr2020

def TIMESAT_stats(dataarray, time_dim='time'):
    """
    For a 1D array of values for a vegetation index - for which higher values tend to 
    indicate more vegetation - determine several statistics:
    1. Beginning of Season (BOS): The time index of the beginning of the growing season.
        (The downward inflection point before the maximum vegetation index value)
    2. End of Season (EOS): The time index of the end of the growing season.
        (The upward inflection point after the maximum vegetation index value)
    3. Middle of Season (MOS): The time index of the maximum vegetation index value.
    4. Length of Season (EOS-BOS): The time length of the season (index difference).
    5. Base Value (BASE): The minimum vegetation index value.
    6. Max Value (MAX): The maximum vegetation index value (the value at MOS).
    7. Amplitude (AMP): The difference between BASE and MAX.
    
    Parameters
    ----------
    dataarray: xarray.DataArray
        The 1D array of non-NaN values to determine the statistics for.
    time_dim: string
        The name of the time dimension in `dataarray`.

    Returns
    -------
    stats: dict
        A dictionary mapping statistic names to values.
    """
    assert time_dim in dataarray.dims, "The parameter `time_dim` is \"{}\", " \
        "but that dimension does not exist in the data.".format(time_dim)
    stats = {}
    data_np_arr = dataarray.values
    time_np_arr = _n64_datetime_to_scalar(dataarray[time_dim].values)
    data_inds = np.arange(len(data_np_arr))
    
    # Obtain the first and second derivatives.
    fst_deriv = np.gradient(data_np_arr, time_np_arr)
    pos_fst_deriv = fst_deriv > 0
    neg_fst_deriv = 0 > fst_deriv
    snd_deriv = np.gradient(fst_deriv, time_np_arr)
    pos_snd_deriv = snd_deriv > 0
    neg_snd_deriv = 0 > snd_deriv
    
    # Determine MOS.
    # MOS is the index of the highest value.
    idxmos = np.argmax(data_np_arr)
    stats['Middle of Season'] = idxmos
    
    data_inds_before_mos = data_inds[:idxmos]
    data_inds_after_mos = data_inds[idxmos:]
    
    # Determine BOS.
    # BOS is the last negative inflection point before the MOS.
    # If that point does not exist, choose the first positive
    # first derivative point before the MOS. If that point does
    # not exist, the BOS is the MOS (there is no point before the MOS in this case).
    snd_deriv_neg_infl = np.concatenate((np.array([False]), neg_snd_deriv[1:] & ~neg_snd_deriv[:-1]))
    if snd_deriv_neg_infl[data_inds_before_mos].sum() > 0:
        idxbos = data_inds_before_mos[len(data_inds_before_mos) - 1 - 
                                      np.argmax(snd_deriv_neg_infl[data_inds_before_mos][::-1])]
    elif pos_fst_deriv[data_inds_before_mos].sum() > 0:
        idxbos = np.argmax(pos_fst_deriv[data_inds_before_mos])   
    else:
        idxbos = idxmos
    stats['Beginning of Season'] = idxbos
    
    # Determine EOS.    
    # EOS is the first positive inflection point after the MOS.
    # If that point does not exist, choose the last negative
    # first derivative point after the MOS. If that point does
    # not exist, the EOS is the MOS (there is no point after the MOS in this case).
    snd_deriv_pos_infl = np.concatenate((np.array([False]), pos_snd_deriv[1:] & ~pos_snd_deriv[:-1]))
    if snd_deriv_pos_infl[data_inds_after_mos].sum() > 0:
        idxeos = data_inds_after_mos[np.argmax(snd_deriv_pos_infl[data_inds_after_mos])]
    elif neg_fst_deriv[data_inds_after_mos].sum() > 0:
        idxeos = np.argmax(neg_fst_deriv[data_inds_after_mos])   ##ERROR_JM: missing [::-1] to get the last and not the first.
    else:
        idxeos = idxmos
    stats['End of Season'] = idxeos
    
    # Determine EOS-BOS.
    stats['Length of Season'] = idxeos - idxbos
    # Determine BASE.
    stats['Base Value'] = data_np_arr.min()
    # Determine MAX.
    stats['Max Value'] = data_np_arr.max()
    # Determine AMP.
    stats['Amplitude'] = stats['Max Value'] - stats['Base Value']
    
    return stats
*/

function Phenology(){};

//The following function emulates np.gradient()
//tol is the tolerance (<1). if the gradient is lower than the tolerance becomes 0. tol=0 means no tolerance is applied.
//d is the constant "x" distance between y values. Not very relevant here and can be 1.
//Returns the first derivative.
//https://stackoverflow.com/questions/29785840/how-to-interpret-numpy-gradient/34905456
//https://numpy.org/doc/stable/reference/generated/numpy.gradient.html

Phenology.regularGradient = function(y, tol, d)
{
var d2=d*2, yg=[], len=y.length, l1=len-1;

	if (len==0)
		return yg;
	else if (len==1)
		yg[0]=0;
	else
	{
		yg[0]=(y[1]-y[0])/d;
		for (var i=1; i<l1; i++)
			yg[i]=(y[i+1]-y[i-1])/d2;		
		yg[l1]=(y[l1]-y[l1-1])/d;
		if (tol)
		{
			for (var i=0; i<len; i++)
			{
				if (Math.abs(y[i])/d*tol>Math.abs(yg[i]))
					yg[i]=0;
			}
		}
	}
	return yg;
}

Phenology.timesat = function(y)
{
var stats={}, y_len=y.length;

	//Obtain the first and second derivatives.
	var fst_deriv = Phenology.regularGradient(y, 0, 1);
	var pos_fst_deriv = fst_deriv.map(function(num){return num>0});
	var neg_fst_deriv = fst_deriv.map(function(num){return 0>num});
	var snd_deriv = Phenology.regularGradient(fst_deriv, 0, 1);
	var pos_snd_deriv = snd_deriv.map(function(num){return num>0});
	var neg_snd_deriv = snd_deriv.map(function(num){return 0>num});

	// Determine POS: the index of the highest value (peak of season).
	stats.idxpos=0;
	stats.pos=y[0];
	for (var i=1; i<y_len; i++)
	{
		if (stats.pos<y[i])
		{
			stats.pos=y[i];
			stats.idxpos=i;
		}
	}
	    
	//Determine SOS: the last negative inflection point before the POS.
    	//If that point does not exist, choose the first positive first derivative point before the POS. 
        //If that point does not exist, the SOS is the POS (there is no point before the POS in this case).

	//var snd_deriv_neg_infl=[0];
	//for (var i=1; i<y_len; i++)  No sembla que calgui calcular tot l'array.
	//	snd_deriv_neg_infl[i]=neg_snd_deriv[i] & ~neg_snd_deriv[i-1];

	var is_there_snd_deriv_neg_infl_before_pos=false, last_snd_deriv_neg_infl_before_pos;
	for (var i=stats.idxpos-1; i>0; i--)
	{
		//if (snd_deriv_neg_infl[i])
		if (neg_snd_deriv[i] & ~neg_snd_deriv[i-1])
		{
			is_there_snd_deriv_neg_infl_before_pos=true;
			last_snd_deriv_neg_infl_before_pos=i;
			break;
		}
	}
	if (is_there_snd_deriv_neg_infl_before_pos)
	        stats.idxsos = last_snd_deriv_neg_infl_before_pos;
	else
	{
		var is_there_pos_fst_deriv_before_pos=false, first_pos_fst_deriv_before_pos;
		for (var i=0; i<stats.idxpos; i++)
		{
			if (pos_fst_deriv[i])
			{
				is_there_pos_fst_deriv_before_pos=true;		
				first_pos_fst_deriv_before_pos=i;
				break;
			}
		}
		if (is_there_pos_fst_deriv_before_pos)
        		stats.idxsos = first_pos_fst_deriv_before_pos;
		else
		        stats.idxsos = stats.idxpos;
	}

	// Determine EOS: the first positive inflection point after the POS.
	// If that point does not exist, choose the last negative first derivative point after the POS. 
	// If that point does not exist, the EOS is the POS (there is no point after the POS in this case).

	//var snd_deriv_pos_infl=[0];
	//for (var i=1; i<y_len; i++)
	//	snd_deriv_pos_infl[i]=pos_snd_deriv[i] & ~pos_snd_deriv[i-1];

	var is_there_snd_deriv_pos_infl_after_pos=false, first_snd_deriv_pos_infl_after_pos;
	for (var i=stats.idxpos+1; i<y_len; i++)
	{
		//if (snd_deriv_pos_infl[i])
		if (pos_snd_deriv[i] & ~pos_snd_deriv[i-1])
		{
			is_there_snd_deriv_pos_infl_after_pos=true;
			first_snd_deriv_pos_infl_after_pos=i;
			break;
		}
	}

	if (is_there_snd_deriv_pos_infl_after_pos)
	        stats.idxeos = first_snd_deriv_pos_infl_after_pos;
	else
	{
		var is_there_neg_fst_deriv_after_pos=false, last_neg_fst_deriv_after_pos;
		for (var i=y_len-1; i>stats.idxpos; i--)
		{
			if (neg_fst_deriv[i])
			{
				is_there_neg_fst_deriv_after_pos=true;		
				last_neg_fst_deriv_after_pos=i;
				break;
			}
		}
		if (is_there_neg_fst_deriv_after_pos)
        		stats.idxeos = last_neg_fst_deriv_after_pos;  
		else
		        stats.idxeos = stats.idxpos;
	}

	// Determine BASE.
    	stats.base = Math.min.apply(null, y);

	return stats;
}

Phenology.derivates = function(stats)
{
	// Determine AOS (amplitude of the season).
    	stats.aos = stats.pos-stats.base;
	// Determine AMP.
	stats.idxlos = stats.idxeos-stats.idxsos;
	//  ROG = Rate of Greening (Days)
	stats.rog = (stats.pos-stats.sos)/(stats.idxpos-stats.idxsos);
	//  ROS = Rate of Senescing (Days)
	stats.ros = (stats.eos-stats.pos)/(stats.idxeos-stats.idxpos);
}

/*Based on: https://github.com/GeoscienceAustralia/dea-notebooks/blob/eb65dcc6d70d3d59655eacd7f38415e017b0c37b/Tools/dea_tools/temporal.py#L136
Phenology.adc = function(y)
{
var stats={}, y_len=y.length;

	// Determine POS: Peak of the Season.
	stats.idxpos=0;
	var pos=y[0];
	for (var i=1; i<y_len; i++)
	{
		if (pos<y[i])
		{
			pos=y[i];
			stats.idxpos=i;
		}
	}

	//Obtain the first and second derivatives.
	var fst_deriv = Phenology.regularGradient(y, 0, 1);

	var pos_fst_deriv=[], median;	
	for (var i=0; i<stats.idxpos; i++)
	{
		if (fst_deriv[i]>0)
			pos_fst_deriv.push(fst_deriv[i]);
	}
	if (!pos_fst_deriv.length)
	{
		stats.sos=stats.pos;
		stats.idxsos=stats.idxpos
	}
	else
	{
		pos_fst_deriv.sort(function(a, b) {return a - b});
		median=pos_fst_deriv[parseInt(pos_fst_deriv.length/2)];
		for (var i=stats.idxpos-1; i>=0; i--)
		{
			if (fst_deriv[i]==median)
			{
				stats.sos=y[i]
				stats.idxsos=i;
				break;
			}	
		}
		if (i<0)//This should not happen
		{
			stats.sos=stats.pos;
			stats.idxsos=idxpos;
		}
	}

	var neg_fst_deriv=[];	
	for (var i=stats.idxpos; i<y_len; i++)
	{
		if (fst_deriv[i]<0)
			neg_fst_deriv.push(fst_deriv[i]);
	}
	if (!neg_fst_deriv.length)
	{
		stats.eos=stats.pos;
		stats.idxeos=stats.idxpos
	}
	else
	{
		neg_fst_deriv.sort(function(a, b) {return a - b});
		median=neg_fst_deriv[parseInt(neg_fst_deriv.length/2)];
		for (var i=stats.idxpos+1; i<y_len; i++)
		{
			if (fst_deriv[i]==median)
			{
				stats.eos=y[i]
				stats.idxeos=i;
				break;
			}	
		}
		if (i==y_len)  //This should not happen
		{
			stats.eos=stats.pos;
			stats.idxeos=stats.idxpos;
		}
	}

	return stats;
}*/

//'param' is an array with the time of each value in milliseconds. The array has the same dimensions than 'v' 
//the return are the 'param' values sincronized with 'v'. 'v' will be modified but 'param' will not.
function RemoveNodataNValues(v, param)
{
var n=v.length, days=[];

	if (v.length==0)
		return [];

	for(var i=0, ii=0; i<n; i++)
	{
		if ((!v[ii]    && v[ii]!=0   ) || 
		    (!param[i] && param[i]!=0)  )
		{
			//elimino aquest element sense res de l'array
			v.splice(ii, 1);
			continue;
		}
		days[ii]=param[i];
		ii++;
	}
	return days;
}

//'param' is an array with the time of each value in milliseconds. The array has the same dimensions than 'v' 
function CalculaStatsPhenologyNValues(v, param)
{
var y_spl=[];

	var days=RemoveNodataNValues(v, param);
	if (days.length==0)
		return null;

	var i_center=GaussianFit.CenterGaussian(v);
	var r_left=GaussianFit.leftGaussian(days, v, i_center);
	var r_right=GaussianFit.rightGaussian(days, v, i_center);

	for (var i=0; i<367; i++)
		y_spl[i]=GaussianFit.evalAssymGaussian(i, r_left, r_right)

	return Phenology.timesat(y_spl);

}

//'param.t' is an array with the time of each value in milliseconds. The array has the same dimensions than 'v' 
//'param.stat' is an string with the name of the statistic needed.
function CalculaPhenologyNValues(v, param)
{
	var stats=CalculaStatsPhenologyNValues(v, param.t);
	if (stats)
		return stats[param.stat];
	return null;
}

function CalculaPhenologyDerivNValues(v, param)
{
	var stats=CalculaStatsPhenologyNValues(v, param.t);
	if (stats)
	{
		Phenology.derivates(stats);
		return stats[param.stat];
	}
	return null;
}