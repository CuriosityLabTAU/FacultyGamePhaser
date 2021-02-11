import ast
import json
from datetime import datetime
import numpy as np
import operator
import pandas as pd
import copy
from os import listdir
from os.path import isfile, join


def split_wav_name(wav_full_path):
    the_split_char = "\\"
    wav_name = str.split(str(wav_full_path), the_split_char)[-1][:3]
    if not wav_name.isalnum():
        the_split_char = '/'
        wav_name = str.split(str(wav_full_path), the_split_char)[-1][:3]
    return wav_name


def read_file(the_file_):
    data = open(str(the_file_), 'r')
    data1=ast.literal_eval(data.readline())

    data2 = {}
    for key in data1.keys():
        if type(data1[key]) == type({}) and 'data' in data1[key]:
            try:
                data1[key]["data"] = json.loads(data1[key]["data"])['log']
            except:
                try:
                    data1[key]["data"] = json.loads(data1[key]["data"])
                except:
                    print('error in ', key)
        elif type(data1[key]) == type(''):
            data2[key] = {
                'raw': data1[key],
                'data': json.loads(data1[key])
            }
        else:
            data2[key] = {
                'raw': data1[key],
                'data': data1[key]
            }

    if len(data2) == 0:
        raw_data_ = data1
    else:
        raw_data_ = data2
    return raw_data_


def create_dict(raw_data_):
    dict = {"experiment": None,
                               "buttons": {},
                               "t0": -1,
                               "stop_button": -1,
                               "wav": {},
                               "listen_t": {},
                               "list_fac": {},
                                   #{"art": 0, "eng": 0, "exa": 0, "hum": 0, "law": 0, "lif": 0, "man": 0, "med": 0,
                                    #"soc": 0},
                               "list_fac_number": {},
                                   #{"art": 0, "eng": 0, "exa": 0, "hum": 0, "law": 0, "lif": 0, "man": 0, "med": 0,
                                    #"soc": 0},
                               'trans_matrix':
                                   {'count': 0,
                                    'prop': 0,
                                    'e_trans': 0, },
                               "wav_sorted": {},
                               "fac_heard": {},
                                   #{"art": 0, "eng": 0, "exa": 0, "hum": 0, "law": 0, "lif": 0, "man": 0, "med": 0,
                                   # "soc": 0},
                               "e_multidis": 0}
    subject_id = ''

    for key in raw_data_.keys():
        current_value = raw_data_[key]

        try:
            if 'subject' in current_value['data']['obj'] and 'text' in current_value['data']['action']:
                if len(current_value['data']['comment']) > len(subject_id):
                    subject_id = current_value['data']['comment']
        except:
            print('ERROR',  'subject_id')

        #### BUTTONS dict['buttons']=
        try:
            if current_value['data']['obj'] in ['consent_button', 'consent_checkbox', 'final_button', 'stop_button'] and \
                    current_value['data']['action'] == 'press':
                time = datetime.strptime(current_value['data']['time'], '%Y_%m_%d_%H_%M_%S_%f')

                # BUG FIX: named the framing_button also consent_button
                if current_value['data']['obj'] == 'consent_button':
                    if current_value['data']['obj'] in dict["buttons"]:
                        if time > dict["buttons"][current_value['data']['obj']]:
                            dict["buttons"]['framing_button'] = time
                        else:
                            dict["buttons"]['framing_button'] = \
                                dict["buttons"]['consent_button']
                            dict["buttons"]['consent_button'] = time
                    else:
                        dict["buttons"][current_value['data']['obj']] = time
                else:
                    dict["buttons"][current_value['data']['obj']] = time

        except:
            print('ERROR',  "buttons")

        #### TO dict['t0']=
        try:
            if current_value['data']['obj'] in ['t0']:
                t0_times = current_value['data']['comment'].split(',')
                dict["t0"] = datetime.strptime(t0_times[1],
                                                                  '%Y_%m_%d_%H_%M_%S_%f') - datetime.strptime(
                    t0_times[0], '%Y_%m_%d_%H_%M_%S_%f')
                # check_t0.append(('ERROR',  current_tab, dict["experiment"], time))
                # print(dict["t0"],"from log", file)
                # print('ERROR',  dict['t0'])

        except:
            print('ERROR',  "t0")

        #### PLAYING TIME dict["wav"]= (wav_full_name.WAV: [("play",play_time),("stop",stop_time)...]
        ## first part - saving playing and stop time
        try:
            if current_value['data']['obj'].lower() in ["art", "eng", "exc", "hum", "law", "life", "man", "med", "soc", "sec"]:
                if "pos" not in current_value['data']['comment']:
                    if current_value['data']['obj'].lower() == "life":
                        current_value['data']['obj'] = "lif"
                    if current_value['data']['obj'].lower() == "exa":
                        current_value['data']['obj'] = "exc"
                    if current_value['data']['comment'].lower() in dict['wav'].keys():
                        # print( current_value['data']['comment'])
                        dict['wav'][current_value['data']['comment'].lower()].append((
                            current_value['data']['action'], current_value['data']['time']))
                    else:
                        dict['wav'][current_value['data']['comment'].lower()] = []
                        dict['wav'][current_value['data']['comment'].lower()].append((
                            current_value['data']['action'], current_value['data']['time']))
        except:
            print('ERROR',  "playing time")

    dict['subject_id'] = subject_id


    #### PLAYING TIME #2   dict["listen_t"]= (wav, time delta between Stop and Play)
    ## second part - calculating the delta for each wav and also saving total listening time per faulty
    for wav in dict['wav'].keys():
        wav_name = split_wav_name(str(wav))
        dict["list_fac"][wav_name] = 0
        dict["list_fac_number"][wav_name] = 0
        dict["fac_heard"][wav_name] = 0

    for wav in dict['wav'].keys():
        if len(dict['wav'][wav]) == 2:
            for p_s in dict['wav'][wav]:
                if p_s[0] == "stop":
                    stop_t = datetime.strptime(p_s[1], '%Y_%m_%d_%H_%M_%S_%f')
                    # print(wav,"stop",stop_t)
                elif p_s[0] == "play":
                    play_t = datetime.strptime(p_s[1], '%Y_%m_%d_%H_%M_%S_%f')
                    # print(wav,"play",play_t)
            dict['listen_t'][wav.lower()] = stop_t - play_t
            wav_name = split_wav_name(str(wav))
            dict["list_fac"][wav_name] += (stop_t - play_t).seconds
            dict["list_fac_number"][wav_name] += 1

    return dict


def data_processing(dict_):
    # calculating the Total listening time per file dict_["listen_t"]["tot"]=
    total_time = []
    e_multi_matrix = []
    t_time = 0
    for wav, t in dict_['listen_t'].items():
        t_time += t.seconds
    dict_['listen_t']["tot"] = t_time
    total_time.append(t_time)
    total_time = np.array(total_time)

    ####  E_MULTIDIS dict_["fac_prop"}= {"art":0,"eng":0...}

    # prop per file and faculty
    for fac, p in dict_["fac_heard"].items():
        if dict_['listen_t']["tot"] != 0:
            dict_["fac_heard"][fac] = dict_['list_fac_number'][fac]

    # calculating the Entropy(Multi Dis)  dict_["e_multidis"}=
    e_m = []
    
    number_heard = int(np.sum([float(x) for x in dict_["fac_heard"].values()]))
    p = np.array([float(x) for x in dict_["fac_heard"].values()]) / float(number_heard)
    dict_["e_multidis"] = 0.0
    for i_fac in range(p.shape[0]):
        if p[i_fac] > 0.0:
            dict_["e_multidis"] -= (np.log2(p[i_fac])) * p[i_fac]
    # --- calculate normalization = equal hearing of all parts -------
    # --- norm_entropy ==> high heard all, low heard the same
    if number_heard < 4:
        dict_["e_multidis"] = -1.0
    else:
        # normalization goes by filling the all the possible bins
        number_bins = np.min([number_heard, 9])  # can't hear more than 9 faculties
        the_bins = np.zeros([number_bins])
        for i_heard in range(number_heard):
            the_bins[i_heard % number_bins] += 1.0 / number_heard
        normalization = 0.0
        for i_bins in range(number_bins):
            normalization -= np.log2(the_bins[i_bins]) * the_bins[i_bins]

        dict_["e_multidis"] = (dict_["e_multidis"] / normalization)
    e_m.append(dict_["e_multidis"])

    e_m = np.array(e_m)


    # adding to dict[file] a sorted dict prepration with play_time:wav for each 'play', dict_["wav_sorted"]={}
    for wav in dict_['wav'].keys():
        for p_s in dict_['wav'][wav]:
            if p_s[0] == "play":
                # print(dict_['wav'][wav],p_s[1],wav[6:9],wav)
                wav_name = split_wav_name(str(wav))
                dict_['wav_sorted'][
                    datetime.strptime(p_s[1], '%Y_%m_%d_%H_%M_%S_%f')] = wav_name

    max_number_wavs_heard = 30
    x = [["" for i in range(max_number_wavs_heard)] for j in range(945)]
    r = 0
    subject_with_faculty = 0
    subject_with_faculty_equal_1st_wav = 0
    # the sorting step
    if dict_['wav_sorted']:
        dict_['wav_sorted'] = sorted(dict_['wav_sorted'].items(),
                                                       key=operator.itemgetter(
                                                           0))  # seconds - problems with seconds
        if dict_['buttons'] and dict_["t0"] == -1:
            if 'framing_button' in dict_['buttons']:
                dict_["t0"] = dict_['wav_sorted'][0][0] - \
                                                dict_['buttons']['framing_button']
            else:
                dict_["t0"] = dict_['wav_sorted'][0][0] - \
                                                dict_['buttons']['consent_button']

        if 'stop_button' in dict_['buttons']:
            dict_["stop_button"] = dict_['buttons']['stop_button'] - \
                                                     dict_['buttons']['framing_button']

        dict_['wav_sorted2'] = []
        for wav in dict_['wav_sorted']:
            dict_['wav_sorted2'].append(wav[1])
        dict_['first_wav_faculty'] = dict_['wav_sorted2'][0]

        c = 0
        for y in (dict_['wav_sorted2']):
            # print(file,c,r,y)
            x[r][c] = y
            c += 1
        r += 1



    ####  E_TRANSE dict_["trans_matrix"}=

    # calculating the Entropy(transfers matrix) dict_["trans_matrix"]["count"}=
    # dict_["trans_matrix"]["prop"}=

    n_of_more_than_4_wavs = 0
    faculty = list(dict_['fac_heard'].keys())
    y = np.zeros((len(faculty), len(faculty)))
    num_transitions = 0
    for r in range(1, len(dict_['wav_sorted'])):
        f = list(dict_['wav_sorted'])[r - 1][1]
        s = list(dict_['wav_sorted'])[r][1]
        y[faculty.index(list(dict_['wav_sorted'])[r - 1][1]), faculty.index(
            list(dict_['wav_sorted'])[r][1])] += 1
        num_transitions += 1
    dict_['trans_matrix']['count'] = y
    dict_['trans_matrix']['num_transitions'] = num_transitions
    sum_y = np.sum(y)
    if sum_y > 4:
        n_of_more_than_4_wavs += 1
    # CHANGED
    if num_transitions > 4:
        dict_['trans_matrix']['prop'] = np.divide(y, sum_y)
    else:
        dict_['trans_matrix']['prop'] = None

    e_t = []
    total_small = []
    total_big = []
    e_m_small = []
    e_m_big = []
    embr = []
    stre = []
    embr_big = []
    stre_big = []
    n_q = 0
    faculties_num_small = []

    sum_prop = 0
    if dict_["listen_t"]["tot"] != 0:
        total_big.append(dict_["listen_t"]["tot"])
        e_m_big.append(dict_["e_multidis"])

    if dict_['trans_matrix']['prop'] is not None:  # had more than 3 wavs
        for x in np.nditer(dict_['trans_matrix']['prop']):
            if x != 0:
                sum_prop -= (np.log2(x)) * (x)
        # --- normalization of transition matrix = log2(1/num_transitions) ---
        # --- norm_entropy ==> high all transitions (chaos), low very ordered
        p_normalization = 1.0 / float(dict_['trans_matrix']['num_transitions'])
        normalization = -np.log2(p_normalization)
        dict_['trans_matrix']['e_trans'] = sum_prop / normalization
        faculties_num = 0
        for x in dict_[
            'fac_heard']:  # check how many diffrent faculties wav has benn listened
            if dict_['fac_heard'][x] > 0:
                faculties_num += 1
        faculties_num_small.append(np.log2(faculties_num))
        total_small.append(dict_["listen_t"]["tot"])
        e_m_small.append(dict_["e_multidis"])
        e_t.append((-1) * sum_prop)
    else:
        dict_['trans_matrix']['e_trans'] = -1.0
    #########print('n_of_more_than_4_wavs',n_of_more_than_4_wavs,'n_q',n_q)
    return (total_time, e_m, e_t, e_m_small, total_small, e_m_big, total_big, embr_big, stre_big, embr, stre,
            faculties_num_small)


def create_excel(all_dict_, csv_filename):
    # convert from dict to numpy array, convert to Excel file
    print(' ------ ')

    number_of_subjects = len(all_dict_)
    x_size = 100
    x = np.ndarray((number_of_subjects, x_size))
    column_titles = []   #columns_titles
    subject_number = -1  #columns_amount
    subject_files = [] #rows,participants

    for dict_ in all_dict_:
        subject_number += 1

        c = 0
        #sub_num
        x[subject_number, c] = float(subject_number)
        c += 1
        if subject_number == 0: # save the title only for the first file
            column_titles.append('subject number')

        #subject_id
        print(dict_['subject_id'])
        try:
            x[subject_number, c] = float(dict_['subject_id'])
        except:
            x[subject_number, c] = -1.0
        c += 1
        if subject_number == 0: # save the title only for the first file
            column_titles.append('subject id')

        #t0  - normalized to [0,60] ==> [0, 1]
        if dict_['t0']!= -1:
            x[subject_number, c]= (dict_['t0'].seconds)
            x[subject_number, c] /= exp_duration
        else:
            x[subject_number, c] = -1 #(dict_['t0'])


        c += 1
        if subject_number == 0:
            column_titles.append('t0')

        #total listenning time
        x[subject_number, c] = float(dict_['listen_t']['tot']) / exp_duration
        c += 1
        if subject_number == 0:
            column_titles.append('total listenning time')

        # normalized total listenning time

        if dict_['t0'] != -1:
            if dict_['stop_button'] != -1:
                x[subject_number, c] = float(dict_['listen_t']['tot']) / (float(dict_['stop_button'].seconds) - float(dict_['t0'].seconds))
            else:
                x[subject_number, c] = float(dict_['listen_t']['tot']) / (exp_duration - float(dict_['t0'].seconds))
        else:
            x[subject_number, c] = -1
            # x[subject_number, c] = float(dict_['listen_t']['tot']) / (60.0 - float(dict_['t0']))
        if x[subject_number, c] > 1.0:
            x[subject_number, c] = -1.0
        c += 1
        if subject_number == 0:
            column_titles.append('normalized total listenning time')

        #Multi entropy
        x[subject_number, c] =  float(dict_["e_multidis"])
        c += 1
        if subject_number == 0:
            column_titles.append('Multi discipline entropy')

        #transition entropy
        x[subject_number, c] = float(dict_['trans_matrix']['e_trans'])
        c += 1
        if subject_number == 0:
            column_titles.append('transition entropy')

        #len(wav_sorted)
        x[subject_number, c] =  float(len(dict_["wav_sorted"]))
        c += 1
        if subject_number == 0:
            column_titles.append('wavs amount')

         #listening time - per faculty
        for i in dict_['fac_heard']:
            x[subject_number, c] =  float(dict_['fac_heard'][i])
            c += 1
            if subject_number == 0:
                column_titles.append('listening per faculty:' + str(i))

        if subject_number == 0:
            x_size = c

    print(x.shape)
    x=x[:, :x_size]
    x = x[x[:, 2] > 0, :]
    x[:, 0]=np.arange(x.shape[0]) + 1

    for i in range(len(column_titles)):
        column_titles[i] = str.replace(column_titles[i], ' ', '_')
        column_titles[i] = str.replace(column_titles[i], '-', '_')
        column_titles[i] = str.replace(column_titles[i], ':', '_')
        column_titles[i] = str.replace(column_titles[i], '+', '_')

    for ict, ct in enumerate(column_titles):
        print(ict, ct)

    df = pd.DataFrame(data=x, columns=column_titles)
    print(df)
    print(df)
    df.to_csv(csv_filename)

    return np,column_titles


# Instructions:
# These are the file names of the log
# the_path = 'C:/Users/LENOVO-P50/Downloads/log_file_TAH/'  # Yvoone
the_path = './data/'    # Goren

# option 1: enter the actual file names
# the_files = [the_path + '2020_08_31_10_34_27_215000.log']

# option 2: read all * log files in "the_path"
the_files = [the_path + f for f in listdir(the_path) if isfile(join(the_path, f)) and 'log' in f]

# This is the game duration
exp_duration = 120.0

all_dict = []
for subject_number, the_file in enumerate(the_files):
    # processing the raw data
    raw_data = read_file(the_file)
    print(' ---- raw data ------')
    print(raw_data)

    # converting to a meaningful dictinary
    dict = create_dict(raw_data)

    # processing the parameters needed
    data_processing(dict)
    print(' ---- dictionary ------')
    for k, v in dict.items():
        print(k, v)

    dict['file'] = the_file

    all_dict.append(copy.copy(dict))
# Saving to a csv file
create_excel(all_dict, "./data/free_exploration_gave_data.csv")