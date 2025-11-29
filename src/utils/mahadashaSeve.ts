import { db } from "../db";

// Helper function to parse Sinhala date to English date
const parseSinhalaDateToEnglish = (dateStr: string): string => {
    // Example: "ඉරි මැයි 04 2014 " -> "2014-05-04"
    const parts = dateStr.trim().split(' ');
    const year = parts[parts.length - 1];
    const day = parts[parts.length - 2].padStart(2, '0');
    
    // Month mapping (Sinhala to month number)
    const monthMap: Record<string, string> = {
           'ජන': '01', 'ජන.': '01', 'ජනවාරි': '01',
        'පෙබ': '02', 'පෙබ.': '02', 'පෙබරවාරි': '02',
        'මාර්': '03', 'මාර්.': '03', 'මාර්තු': '03',
        'අප්': '04', 'අප්‍රේල්': '04',
        'මැයි': '05',
        'ජුනි': '06', 'ජූනි': '06',
        'ජූලි': '07',
        'අගෝ': '08', 'අගෝ.': '08', 'අගෝස්තු': '08',
        'සැප්': '09', 'සැප්.': '09', 'සැප්තැම්බර්': '09',
        'ඔක්': '10', 'ඔක්.': '10', 'ඔක්තෝබර්': '10',
        'නොවැ': '11', 'නොවැ.': '11', 'නොවැම්බර්': '11',
        'දෙසැ': '12', 'දෙසැ.': '12', 'දෙසැම්බර්': '12',
    };
    
    const monthStr = parts[1];
    const month = monthMap[monthStr] || '01';
    
    return `${year}-${month}-${day}`;
};

export const saveDashaFromApi = async (userId: number, apiResponse: any) => {
    const dashaData = apiResponse.response;

    if (!dashaData || !dashaData.mahadasha) {
        throw new Error("Invalid API response structure");
    }

    // Prepare the dasha records with English dates
    const dashaRecords = dashaData.mahadasha.map((planet: string, index: number) => {
        const fromDateSinhala = index === 0 
            ? dashaData.dasha_start_date 
            : dashaData.mahadasha_order[index - 1];
        const toDateSinhala = dashaData.mahadasha_order[index];

        return {
            userId: String(userId),
            dashawa: planet,
            From: parseSinhalaDateToEnglish(fromDateSinhala),
            To: parseSinhalaDateToEnglish(toDateSinhala)
        };
    });

    // Use findOrCreate and update pattern for each dasha record
    for (const record of dashaRecords) {
        const [dashaRecord, created] = await db.DashaBalance.findOrCreate({
            where: {
                userId: String(userId),
                dashawa: record.dashawa
            },
            defaults: {
                ...record
            }
        });

        if (!created) {
            await dashaRecord.update({
                From: record.from,
                To: record.to
            });
        }
    }


    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0];

    // Find the current dasha record
    const savedRecords = await db.DashaBalance.findAll({
        where: { userId: String(userId) },
        order: [['id', 'ASC']]
    });

    // Find current dasha
    let currentDasha = null;
    for (const record of savedRecords) {
        if (currentDateStr >= record.From && currentDateStr < record.To) {
            currentDasha = {
                dasha: record.dashawa,
                from: record.From,
                to: record.To
            };
            break;
        }
    }

    return {
        success: true,
        data: {
            start_year: dashaData.start_year,
            dasha_start_date: dashaData.dasha_start_date,
            dasha_remaining_at_birth: dashaData.dasha_remaining_at_birth,
            current_dasha: currentDasha,
        },
        message: "Dasha data saved successfully",
    };
};